import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = new Set(['en', 'es']);

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet],
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    private readonly translate = inject(TranslateService);

    constructor() {
        const browserLanguage = this.translate.getBrowserLang() ?? DEFAULT_LANGUAGE;

        this.translate.setDefaultLang(DEFAULT_LANGUAGE);
        this.translate.use(SUPPORTED_LANGUAGES.has(browserLanguage) ? browserLanguage : DEFAULT_LANGUAGE);
    }
}
