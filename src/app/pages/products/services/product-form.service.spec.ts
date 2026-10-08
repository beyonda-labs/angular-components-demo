import { TestBed } from '@angular/core/testing';
import { BeyPageFormConfig } from '@beyonda-labs/angular-components';

import { Product, ProductFormValue } from '../models/product.model';
import { ProductFormService } from './product-form.service';

describe('ProductFormService', () => {
    let config: BeyPageFormConfig<ProductFormValue, Product>;

    function buildProduct(overrides: Partial<Product> = {}): Product {
        return { available: true, category: 'Tools', id: 1, name: 'Hammer', price: 12.5, ...overrides };
    }

    function fieldKeys(product?: Product): string[] {
        return config
            .buildSections(product)
            .flatMap(section => section.rows)
            .flatMap(row => row.fields)
            .map(field => field.key);
    }

    beforeEach(() => {
        config = TestBed.inject(ProductFormService).buildFormConfig();
    });

    it('opens the edit form with the product values', () => {
        expect(config.toFormValue(buildProduct({ available: 1 }))).toEqual({
            product: { available: true, category: 'Tools', name: 'Hammer', price: 12.5 }
        });
    });

    it('opens the create form empty', () => {
        expect(config.toFormValue()).toBeUndefined();
    });

    it('sends availability only when the form has the field', () => {
        expect(config.toItem({ product: { category: 'Tools', name: 'Hammer', price: 3 } })).toEqual({
            category: 'Tools',
            name: 'Hammer',
            price: 3
        });
        expect(config.toItem({ product: { available: false, category: 'Tools', name: 'Hammer', price: 3 } })).toEqual({
            available: false,
            category: 'Tools',
            name: 'Hammer',
            price: 3
        });
    });

    it('asks for availability only when editing', () => {
        expect(fieldKeys()).not.toContain('available');
        expect(fieldKeys(buildProduct())).toContain('available');
    });
});
