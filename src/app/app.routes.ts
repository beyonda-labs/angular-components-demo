import { Routes } from '@angular/router';
import { beyAuthGuard, beyLoginGuard, BeyLoginOAuthCallbackComponent } from '@beyonda-labs/angular-components';
import { DemoComponent } from './pages/demo/demo.component';
import { PageComponent } from './pages/page/page.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'demo',
        pathMatch: 'full'
    },
    {
        path: 'demo',
        component: DemoComponent,
        canActivate: [beyLoginGuard]
    },
    {
        path: 'page',
        component: PageComponent,
        canActivate: [beyAuthGuard]
    },
    {
        path: 'oauth/callback',
        component: BeyLoginOAuthCallbackComponent
    },
    {
        path: '**',
        redirectTo: 'demo'
    }
];
