import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BeySessionService, BeySessionUser } from '@beyonda-labs/angular-components';
import {
    beyButtonByName,
    beyHostOf,
    beyRenderComponent,
    beySettle,
    provideBeyTesting
} from '@beyonda-labs/angular-components/testing';

import { AppShellComponent } from './app-shell.component';

const LOGIN_ROUTE = '/demo';
const LOGOUT = 'angular-components-demo.shell.actions.logout.label';
const LOGOUT_URL = 'https://api.test/auth/logout';

describe('AppShellComponent', () => {
    let fixture: ComponentFixture<AppShellComponent>;
    let session: BeySessionService;

    function buildUser(): BeySessionUser {
        return { allowedPaths: [], email: 'ada@example.com', name: 'Ada', redirectPath: '/demo', surname: 'Lovelace' };
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [AppShellComponent],
            providers: [provideBeyTesting({ session: { loginRoute: LOGIN_ROUTE } }), provideRouter([])]
        });
        session = TestBed.inject(BeySessionService);
        fixture = await beyRenderComponent(AppShellComponent);
    });

    it('signs out at the server, then clears the session and returns to the demo page', async () => {
        session.setUser(buildUser());
        const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
        await beySettle(fixture);

        beyButtonByName(fixture, LOGOUT).click();
        await beySettle(fixture);
        TestBed.inject(HttpTestingController).expectOne({ method: 'POST', url: LOGOUT_URL }).flush(null);
        await beySettle(fixture);

        expect(session.user()).toBeNull();
        expect(navigate).toHaveBeenCalledWith([LOGIN_ROUTE]);
    });

    it('shows the user of the session in the menu', async () => {
        expect(beyHostOf(fixture).textContent).not.toContain('Ada Lovelace');

        session.setUser(buildUser());
        await beySettle(fixture);

        expect(beyHostOf(fixture).textContent).toContain('Ada Lovelace');
    });
});
