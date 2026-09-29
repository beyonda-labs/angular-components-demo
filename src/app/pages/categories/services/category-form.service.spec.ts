import { TestBed } from '@angular/core/testing';

import { CategoryItem } from '../models/category.model';
import { CategoryFormService } from './category-form.service';

describe('CategoryFormService', () => {
    let service: CategoryFormService;

    function buildItem(overrides: Partial<CategoryItem> = {}): CategoryItem {
        return { id: 1, name: 'Hammer', price: 12.5, ...overrides };
    }

    beforeEach(() => {
        service = TestBed.inject(CategoryFormService);
    });

    describe('buildItemFormConfig', () => {
        it('opens the product form with the product values', () => {
            expect(service.buildItemFormConfig().toFormValue(buildItem())).toEqual({
                item: { name: 'Hammer', price: 12.5 }
            });
        });

        it('opens the create form empty', () => {
            expect(service.buildItemFormConfig().toFormValue()).toBeUndefined();
        });

        it('sends the name and the price of a product', () => {
            expect(service.buildItemFormConfig().toItem({ item: { name: 'Hammer', price: 3 } })).toEqual({
                name: 'Hammer',
                price: 3
            });
        });
    });

    describe('buildCategoryFormConfig', () => {
        it('opens the category form with its name', () => {
            expect(service.buildCategoryFormConfig().toFormValue({ id: 2, name: 'Tools' })).toEqual({
                category: { name: 'Tools' }
            });
        });

        it('opens the create category form empty', () => {
            expect(service.buildCategoryFormConfig().toFormValue()).toBeUndefined();
        });

        it('names a category from its form', () => {
            expect(service.buildCategoryFormConfig().toItem({ category: { name: 'Tools' } })).toEqual({
                name: 'Tools'
            });
        });
    });
});
