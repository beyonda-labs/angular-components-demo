import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { faArrowRightFromBracket, faFolderTree, faHouse } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

import {
    BeyAppLayoutBottomAction,
    BeyAppLayoutComponent,
    BeyAppLayoutConfig,
    BeyAppLayoutService,
    BeyAppLayoutTopAction,
    BeyLeftMenuTitle,
    BeyLeftMenuUserInfo,
    BeySessionService
} from '@beyonda-labs/angular-components';

const ICON_SRC = 'assets/angular-components/icons/demo-icon.svg';
const PREFIX = 'angular-components-demo.shell';

@Component({
    selector: 'app-shell',
    imports: [BeyAppLayoutComponent, RouterOutlet, TranslateModule],
    templateUrl: './app-shell.component.html',
    standalone: true
})
export class AppShellComponent {
    private readonly appLayoutService = inject(BeyAppLayoutService);
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
                new BeyAppLayoutTopAction({ icon: faHouse, key: 'products', route: '/products' }),
                new BeyAppLayoutTopAction({ icon: faFolderTree, key: 'categories', route: '/categories' })
            ],
            bottomActions: [new BeyAppLayoutBottomAction({ icon: faArrowRightFromBracket, key: 'logout' })],
            userInfo: user
                ? new BeyLeftMenuUserInfo({ name: user.name ?? '', surname: user.surname ?? '', email: user.email })
                : undefined,
            onMenuActionClick: key => this.onMenuAction(key),
            onRouteActivated: () => this.appLayoutService.clearBreadcrumb()
        });
    }

    private onMenuAction(key: string): void {
        if (key === 'logout') {
            this.sessionService.clear();
            this.router.navigate(['/demo']);

            return;
        }

        this.router.navigate([`/${key}`]);
    }
}
