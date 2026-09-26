import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DemoComponent } from './demo.component';

describe('DemoComponent', () => {
    it('renders the library style guide', () => {
        TestBed.configureTestingModule({ imports: [DemoComponent] }).overrideComponent(DemoComponent, {
            set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] }
        });

        const fixture = TestBed.createComponent(DemoComponent);

        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('bey-style-guide')).not.toBeNull();
    });
});
