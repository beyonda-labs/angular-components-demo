import { TestBed } from '@angular/core/testing';

import { Product } from '../models/product.model';
import { ProductTableService } from './product-table.service';

describe('ProductTableService', () => {
    let service: ProductTableService;

    function buildProduct(overrides: Partial<Product> = {}): Product {
        return { available: true, category: 'Tools', id: 1, name: 'Hammer', price: 12.5, ...overrides };
    }

    beforeEach(() => {
        service = TestBed.inject(ProductTableService);
    });

    it('shows each product with its price in euros', () => {
        expect(service.loadRow(buildProduct()).map(cell => cell.content)).toEqual(['Hammer', 'Tools', '12.50 €']);
    });

    it('leaves the price empty when the product has none', () => {
        expect(service.loadRow(buildProduct({ price: undefined }))[2].content).toBe('');
    });
});
