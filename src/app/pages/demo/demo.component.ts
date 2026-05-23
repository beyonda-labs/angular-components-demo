import { Component } from '@angular/core';
import { BeyStyleGuideComponent } from '@beyonda-labs/angular-components';

@Component({
    selector: 'app-demo',
    imports: [BeyStyleGuideComponent],
    templateUrl: './demo.component.html',
    standalone: true
})
export class DemoComponent {}
