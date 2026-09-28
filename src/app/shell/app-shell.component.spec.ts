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

const LOGOUT = 'angular-components-demo.shell.actions.logout.label';

describe('AppShellComponent', () => {
    let fixture: ComponentFixture<AppShellComponent>;
    let session: BeySessionService;

    function buildUser(): BeySessionUser {
        return { allowedPaths: [], email: 'ada@example.com', name: 'Ada', redirectPath: '/demo', surname: 'Lovelace' };
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [AppShellComponent],
            providers: [provideBeyTesting(), provideRouter([])]
        });
        session = TestBed.inject(BeySessionService);
        fixture = await beyRenderComponent(AppShellComponent);
    });

    it('logs out and returns to the demo page', async () => {
        session.setUser(buildUser());
        const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
        await beySettle(fixture);

        beyButtonByName(fixture, LOGOUT).click();
        await beySettle(fixture);

        expect(session.user()).toBeNull();
        expect(navigate).toHaveBeenCalledWith(['/demo']);
    });

    it('shows the user of the session in the menu', async () => {
        expect(beyHostOf(fixture).textContent).not.toContain('Ada Lovelace');

        session.setUser(buildUser());
        await beySettle(fixture);

        expect(beyHostOf(fixture).textContent).toContain('Ada Lovelace');
    });
});
