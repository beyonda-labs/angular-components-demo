import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideBeyApp } from '@beyonda-labs/angular-components';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideBeyApp({
            environment: {
                accessControlUrl: environment.accessControlUrl,
                appName: environment.appName,
                cookieName: environment.cookieName,
                webApiPath: environment.webApiPath,
                baseUrl: environment.baseUrl
            },
            session: { loginRoute: '/demo' }
        })
    ]
};
