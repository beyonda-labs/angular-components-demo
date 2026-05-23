import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true
})
export class AppComponent {
    constructor(private translate: TranslateService) {
        this.translate.setDefaultLang('en');

        const browserLang = this.translate.getBrowserLang() || 'en';
        this.translate.use(browserLang.match(/en|es/) ? browserLang : 'en');
    }
}