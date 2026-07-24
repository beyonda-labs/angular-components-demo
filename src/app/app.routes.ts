import { Routes } from '@angular/router';
import { beyAuthGuard, beyLoginGuard, BeyLoginOAuthCallbackComponent } from '@beyonda-labs/angular-components';
import { CategoriesComponent } from './pages/categories/categories.component';
import { DemoComponent } from './pages/demo/demo.component';
import { ProductsComponent } from './pages/products/products.component';
import { AppShellComponent } from './shell/app-shell.component';

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
        path: '',
        component: AppShellComponent,
        children: [
            {
                path: 'products',
                component: ProductsComponent,
                canActivate: [beyAuthGuard]
            },
            {
                path: 'categories',
                component: CategoriesComponent,
                canActivate: [beyAuthGuard]
            }
        ]
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
