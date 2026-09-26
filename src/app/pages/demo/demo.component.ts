import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BeyStyleGuideComponent } from '@beyonda-labs/angular-components/style-guide';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [BeyStyleGuideComponent],
    selector: 'app-demo',
    templateUrl: './demo.component.html'
})
export class DemoComponent {}
