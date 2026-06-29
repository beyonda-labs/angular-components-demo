import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRightFromBracket, faHouse } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

import {
    BeyAppLayoutBottomAction,
    BeyAppLayoutComponent,
    BeyAppLayoutConfig,
    BeyAppLayoutTopAction,
    BeyLeftMenuTitle,
    BeyLeftMenuUserInfo,
    BeySessionService
} from '@beyonda-labs/angular-components';

const ICON_SRC = 'assets/angular-components/icons/demo-icon.svg';
const PREFIX = 'angular-components-demo.page';

@Component({
    selector: 'app-page',
    imports: [BeyAppLayoutComponent, TranslateModule],
    templateUrl: './page.component.html',
    standalone: true
})
export class PageComponent {
    private readonly router = inject(Router);
    private readonly sessionService = inject(BeySessionService);

    readonly config = this.buildConfig();

    private buildConfig(): BeyAppLayoutConfig {
        const user = this.sessionService.user();

        return new BeyAppLayoutConfig({
            iconSrc: ICON_SRC,
            productName: `${PREFIX}.productName`,
            prefix: PREFIX,
            title: new BeyLeftMenuTitle({ icon: ICON_SRC, title: `${PREFIX}.title` }),
            topActions: [
                new BeyAppLayoutTopAction({ icon: faHouse, key: 'page', route: '/page' })
            ],
            bottomActions: [
                new BeyAppLayoutBottomAction({ icon: faArrowRightFromBracket, key: 'logout' })
            ],
            userInfo: user
                ? new BeyLeftMenuUserInfo({ name: user.name ?? '', surname: user.surname ?? '', email: user.email })
                : undefined,
            onMenuActionClick: key => this.onMenuAction(key)
        });
    }

    private onMenuAction(key: string): void {
        if (key === 'logout') {
            this.sessionService.clear();
            this.router.navigate(['/demo']);
        }
    }
}
