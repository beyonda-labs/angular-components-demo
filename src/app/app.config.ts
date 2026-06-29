import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideRouter } from '@angular/router';
import { beySessionInterceptor, provideBeyEnvironment, provideBeyModal, provideBeySession, provideBeyToast } from '@beyonda-labs/angular-components';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(withInterceptors([beySessionInterceptor])),
        provideBeyModal(),
        provideBeyToast(),
        provideBeySession({ loginRoute: '/demo' }),
        provideBeyEnvironment({
            accessControlUrl: environment.accessControlUrl,
            appName: environment.appName,
            cookieName: environment.cookieName,
            webApiPath: environment.webApiPath,
            baseUrl: environment.baseUrl,
        }),
        importProvidersFrom(
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                }
            })
        ),
    ]
};

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
