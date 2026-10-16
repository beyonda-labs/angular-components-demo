import { BeyPageFormConfig, BeyPageItem, BeyTableCell } from '@beyonda-labs/angular-components';

export interface CategoriesPageConfigOptions {
    categoryFormConfig: BeyPageFormConfig<CategoryFormValue, Category>;
    formConfig: BeyPageFormConfig<CategoryItemFormValue, CategoryItem>;
    loadRow: (item: CategoryItem) => BeyTableCell[];
}

export interface Category extends BeyPageItem {
    name: string;
}

export interface CategoryFormValue {
    category: {
        name: string;
    };
}

export interface CategoryItem extends BeyPageItem {
    name: string;
    price: number;
}

export interface CategoryItemFormValue {
    item: {
        name: string;
        price: number;
    };
}
