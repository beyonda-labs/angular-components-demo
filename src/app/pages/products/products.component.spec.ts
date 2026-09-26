import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BeyPageItem, BeyPageViewMode } from '@beyonda-labs/angular-components';

import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
    let component: ProductsComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [ProductsComponent] }).overrideComponent(ProductsComponent, {
            set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] }
        });
        component = TestBed.createComponent(ProductsComponent).componentInstance;
    });

    it('shows each product with its price in euros', () => {
        const item = { category: 'Tools', id: 1, name: 'Hammer', price: 12.5 } as unknown as BeyPageItem;

        const cells = component.config.tableConfig!.loadRow(item, BeyPageViewMode.Table);

        expect(cells.map(cell => cell.content)).toEqual(['Hammer', 'Tools', '12.50 €']);
    });

    it('leaves the price empty when the product has none', () => {
        const item = { category: 'Tools', id: 1, name: 'Hammer' } as unknown as BeyPageItem;

        const cells = component.config.tableConfig!.loadRow(item, BeyPageViewMode.Table);

        expect(cells[2].content).toBe('');
    });

    it('opens the edit form with the product values', () => {
        const item = { available: 1, category: 'Tools', id: 1, name: 'Hammer', price: 12.5 } as unknown as BeyPageItem;

        expect(component.config.formConfig!.toFormValue(item)).toEqual({
            product: { available: true, category: 'Tools', name: 'Hammer', price: 12.5 }
        });
    });

    it('opens the create form empty', () => {
        expect(component.config.formConfig!.toFormValue()).toBeUndefined();
    });

    it('sends availability only when the form has the field', () => {
        const formConfig = component.config.formConfig!;

        expect(formConfig.toItem({ product: { category: 'Tools', name: 'Hammer', price: 3 } })).toEqual({
            category: 'Tools',
            name: 'Hammer',
            price: 3
        });
        expect(
            formConfig.toItem({ product: { available: false, category: 'Tools', name: 'Hammer', price: 3 } })
        ).toEqual({ available: false, category: 'Tools', name: 'Hammer', price: 3 });
    });

    it('asks for availability only when editing', () => {
        const fieldKeys = (item?: BeyPageItem): string[] =>
            component.config
                .formConfig!.buildSections(item)
                .flatMap(section => section.rows)
                .flatMap(row => row.fields)
                .map(field => field.key);

        expect(fieldKeys()).not.toContain('available');
        expect(fieldKeys({ id: 1 } as BeyPageItem)).toContain('available');
    });
});
