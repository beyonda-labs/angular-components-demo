import { BeyPageItem } from '@beyonda-labs/angular-components';

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
