import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
import { faArrowRightFromBracket, faFolderTree, faHouse } from '@fortawesome/free-solid-svg-icons';

const ICON_SRC = 'assets/angular-components/icons/demo-icon.svg';
const LOGOUT_KEY = 'logout';
const PREFIX = 'angular-components-demo.shell';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [BeyAppLayoutComponent, RouterOutlet],
    selector: 'app-shell',
    templateUrl: './app-shell.component.html'
})
export class AppShellComponent {
    private readonly sessionService = inject(BeySessionService);

    readonly config = computed(() => {
        const user = this.sessionService.user();

        return new BeyAppLayoutConfig({
            bottomActions: [new BeyAppLayoutBottomAction({ icon: faArrowRightFromBracket, key: LOGOUT_KEY })],
            iconSrc: ICON_SRC,
            onMenuActionClick: key => this.onMenuAction(key),
            onRouteActivated: () => this.appLayoutService.clearBreadcrumb(),
            prefix: PREFIX,
            productName: `${PREFIX}.product-name`,
            title: new BeyLeftMenuTitle({ icon: ICON_SRC, title: `${PREFIX}.title` }),
            topActions: [
                new BeyAppLayoutTopAction({ icon: faHouse, key: 'products', route: '/products' }),
                new BeyAppLayoutTopAction({ icon: faFolderTree, key: 'categories', route: '/categories' })
            ],
            userInfo: user
                ? new BeyLeftMenuUserInfo({ email: user.email, name: user.name ?? '', surname: user.surname ?? '' })
                : undefined
        });
    });

    private readonly appLayoutService = inject(BeyAppLayoutService);
    private readonly router = inject(Router);

    private onMenuAction(key: string): void {
        if (key === LOGOUT_KEY) {
            this.sessionService.clear();
            this.router.navigate(['/demo']);

            return;
        }

        this.router.navigate([`/${key}`]);
    }
}
