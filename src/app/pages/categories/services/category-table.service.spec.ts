import { TestBed } from '@angular/core/testing';

import { CategoryItem } from '../models/category.model';
import { CategoryTableService } from './category-table.service';

describe('CategoryTableService', () => {
    let service: CategoryTableService;

    function buildItem(overrides: Partial<CategoryItem> = {}): CategoryItem {
        return { id: 1, name: 'Hammer', price: 12.5, ...overrides };
    }

    beforeEach(() => {
        service = TestBed.inject(CategoryTableService);
    });

    it('shows an item with its price in euros', () => {
        expect(service.loadRow(buildItem()).map(cell => cell.content)).toEqual(['Hammer', '12.50 €']);
    });

    it('leaves the price empty when the item has none', () => {
        expect(service.loadRow(buildItem({ price: undefined }))[1].content).toBe('');
    });
});
