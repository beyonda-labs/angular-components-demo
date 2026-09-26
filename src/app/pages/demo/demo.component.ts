import { Component } from '@angular/core';
import { BeyStyleGuideComponent } from '@beyonda-labs/angular-components/style-guide';

@Component({
    selector: 'app-demo',
    imports: [BeyStyleGuideComponent],
    templateUrl: './demo.component.html',
    standalone: true
})
export class DemoComponent {}
