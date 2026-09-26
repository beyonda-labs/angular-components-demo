import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BeyAppLayoutService, BeySessionService } from '@beyonda-labs/angular-components';

import { AppShellComponent } from './app-shell.component';

describe('AppShellComponent', () => {
    const user = signal<{ email: string; name?: string; surname?: string } | null>(null);
    const session = { clear: jest.fn(), user };
    const router = { navigate: jest.fn() };
    let component: AppShellComponent;

    beforeEach(() => {
        session.clear.mockReset();
        router.navigate.mockReset();
        user.set(null);

        TestBed.configureTestingModule({
            imports: [AppShellComponent],
            providers: [
                { provide: BeySessionService, useValue: session },
                { provide: Router, useValue: router },
                { provide: BeyAppLayoutService, useValue: { clearBreadcrumb: jest.fn() } }
            ]
        }).overrideComponent(AppShellComponent, { set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] } });
        component = TestBed.createComponent(AppShellComponent).componentInstance;
    });

    it('logs out and returns to the demo page', () => {
        component.config().onMenuActionClick?.('logout');

        expect(session.clear).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/demo']);
    });

    it('navigates to the page an action names', () => {
        component.config().onMenuActionClick?.('categories');

        expect(session.clear).not.toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/categories']);
    });

    it('shows the user of the session in the menu', () => {
        expect(component.config().userInfo).toBeUndefined();

        user.set({ email: 'ada@example.com', name: 'Ada', surname: 'Lovelace' });

        expect(component.config().userInfo?.initials).toBe('AL');
    });
});
