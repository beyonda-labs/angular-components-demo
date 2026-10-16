import { BeyPageFormConfig, BeyPageItem, BeyTableCell } from '@beyonda-labs/angular-components';

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

export interface ProductsPageConfigOptions {
    formConfig: BeyPageFormConfig<ProductFormValue, Product>;
    loadRow: (product: Product) => BeyTableCell[];
}
