import {
    BeyPageConfig,
    BeyPageFormConfig,
    BeyPageHeaderConfig,
    BeyPageStandardAction,
    beyPageStandardAction,
    BeyPageTableConfig,
    BeyPageTableSearchConfig,
    BeySearchField,
    BeySearchFieldType,
    BeySearchSortDirection,
    BeyTableCell,
    BeyTableColumn
} from '@beyonda-labs/angular-components';

import { Product, ProductFormValue } from './models/product.model';

const PREFIX = 'angular-components-demo.products';

export interface ProductsPageConfigOptions {
    formConfig: BeyPageFormConfig<ProductFormValue, Product>;
    loadRow: (product: Product) => BeyTableCell[];
}

export function buildProductsPageConfig({
    formConfig,
    loadRow
}: ProductsPageConfigOptions): BeyPageConfig<ProductFormValue, Product> {
    return new BeyPageConfig<ProductFormValue, Product>({
        baseUrl: '/products',
        formConfig,
        headerConfig: new BeyPageHeaderConfig({
            actions: [
                beyPageStandardAction(BeyPageStandardAction.Create),
                beyPageStandardAction(BeyPageStandardAction.Edit),
                beyPageStandardAction(BeyPageStandardAction.Delete)
            ],
            title: `${PREFIX}.title`
        }),
        prefix: PREFIX,
        tableConfig: new BeyPageTableConfig({
            columns: [
                new BeyTableColumn({ key: 'name', width: 4 }),
                new BeyTableColumn({ key: 'category', width: 3 }),
                new BeyTableColumn({ key: 'price', width: 2 })
            ],
            height: 'calc(100vh - 290px)',
            loadRow,
            order: { direction: BeySearchSortDirection.Asc, field: 'name' },
            search: new BeyPageTableSearchConfig({
                fields: [
                    new BeySearchField({ key: 'name', type: BeySearchFieldType.Text }),
                    new BeySearchField({ key: 'category', type: BeySearchFieldType.Text }),
                    new BeySearchField({ key: 'price', type: BeySearchFieldType.Number }),
                    new BeySearchField({ key: 'available', type: BeySearchFieldType.Boolean })
                ],
                mainField: 'name'
            })
        })
    });
}
