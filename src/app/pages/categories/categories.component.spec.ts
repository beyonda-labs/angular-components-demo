import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
    BeyLinkTableCell,
    BeyPageHandle,
    BeyPageItem,
    BeyPageItemType,
    BeyPageViewMode
} from '@beyonda-labs/angular-components';

import { CategoriesComponent } from './categories.component';

describe('CategoriesComponent', () => {
    let component: CategoriesComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [CategoriesComponent] }).overrideComponent(CategoriesComponent, {
            set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] }
        });
        component = TestBed.createComponent(CategoriesComponent).componentInstance;
    });

    function rowFor(item: object): ReturnType<NonNullable<typeof component.config.tableConfig>['loadRow']> {
        return component.config.tableConfig!.loadRow(item as BeyPageItem, BeyPageViewMode.Table);
    }

    it('shows an item with its price in euros', () => {
        const cells = rowFor({ id: 1, name: 'Hammer', price: 12.5, type: BeyPageItemType.Item });

        expect(cells.map(cell => cell.content)).toEqual(['Hammer', '12.50 €']);
    });

    it('opens a category from its link once the page is ready', () => {
        const openCategory = jest.fn();
        const category = { id: 7, name: 'Tools', type: BeyPageItemType.Category };

        component.config.onReady?.({ openCategory } as unknown as BeyPageHandle);
        (rowFor(category)[0] as BeyLinkTableCell).action();

        expect(openCategory).toHaveBeenCalledWith(category);
    });

    it('opens the item form with the item values', () => {
        const item = { id: 1, name: 'Hammer', price: 12.5 } as unknown as BeyPageItem;

        expect(component.config.formConfig!.toFormValue(item)).toEqual({ item: { name: 'Hammer', price: 12.5 } });
    });

    it('names a category from its form', () => {
        const categoryForm = component.config.tableConfig!.categoriesConfig!.formConfig!;

        expect(categoryForm.toItem({ category: { name: 'Tools' } })).toEqual({ name: 'Tools' });
    });
});
