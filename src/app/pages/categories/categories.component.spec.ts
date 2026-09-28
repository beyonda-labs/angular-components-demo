import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BeyPageViewMode } from '@beyonda-labs/angular-components';

import { CategoriesComponent } from './categories.component';
import { CategoryItem } from './models/category.model';

describe('CategoriesComponent', () => {
    let component: CategoriesComponent;

    function buildItem(overrides: Partial<CategoryItem> = {}): CategoryItem {
        return { id: 1, name: 'Hammer', price: 12.5, ...overrides };
    }

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [CategoriesComponent] }).overrideComponent(CategoriesComponent, {
            set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] }
        });
        component = TestBed.createComponent(CategoriesComponent).componentInstance;
    });

    it('shows an item with its price in euros', () => {
        const cells = component.config.tableConfig!.loadRow(buildItem(), BeyPageViewMode.Table);

        expect(cells.map(cell => cell.content)).toEqual(['Hammer', '12.50 €']);
    });

    it('opens the item form with the item values', () => {
        expect(component.config.formConfig!.toFormValue(buildItem())).toEqual({
            item: { name: 'Hammer', price: 12.5 }
        });
    });

    it('names a category from its form', () => {
        const categoryForm = component.config.tableConfig!.categoriesConfig!.formConfig!;

        expect(categoryForm.toItem({ category: { name: 'Tools' } })).toEqual({ name: 'Tools' });
    });
});
