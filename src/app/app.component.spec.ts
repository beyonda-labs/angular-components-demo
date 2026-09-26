import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
    function startWithBrowserLanguage(language?: string): TranslateService {
        TestBed.configureTestingModule({
            imports: [AppComponent, TranslateModule.forRoot()],
            providers: [provideRouter([])]
        });

        const translate = TestBed.inject(TranslateService);

        jest.spyOn(translate, 'getBrowserLang').mockReturnValue(language);
        TestBed.createComponent(AppComponent);

        return translate;
    }

    it('uses the browser language when the demo supports it', () => {
        expect(startWithBrowserLanguage('es').currentLang).toBe('es');
    });

    it('falls back to English for any other language', () => {
        expect(startWithBrowserLanguage('fr').currentLang).toBe('en');
    });

    it('falls back to English when the browser does not tell', () => {
        expect(startWithBrowserLanguage().currentLang).toBe('en');
    });
});
