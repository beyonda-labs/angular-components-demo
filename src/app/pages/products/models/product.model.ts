import { BeyPageItem } from '@beyonda-labs/angular-components';

export interface Product extends BeyPageItem {
    available: boolean | number;
    category: string;
    name: string;
    price: number;
}

export interface ProductFormValue {
    product: {
        category: string;
        name: string;
        price: number;

        available?: boolean | null;
    };
}
