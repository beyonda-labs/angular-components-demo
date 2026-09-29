import { BeyPageFormConfig, BeyPageStandardAction, BeyPageViewMode } from '@beyonda-labs/angular-components';

import { Product, ProductFormValue } from './models/product.model';
import { buildProductsPageConfig } from './products-page-config';

describe('buildProductsPageConfig', () => {
    const formConfig = new BeyPageFormConfig<ProductFormValue, Product>({
        buildSections: () => [],
        prefix: 'angular-components-demo.products.form'
    });
    const loadRow = jest.fn(() => []);

    it('offers the standard create, edit and delete, with no handler of its own', () => {
        const actions = buildProductsPageConfig({ formConfig, loadRow }).headerConfig?.actions ?? [];

        expect(actions.map(action => [action.key, action.handler])).toEqual([
            [BeyPageStandardAction.Create, undefined],
            [BeyPageStandardAction.Edit, undefined],
            [BeyPageStandardAction.Delete, undefined]
        ]);
    });

    it('draws each row with the given loader and edits with the given form', () => {
        const config = buildProductsPageConfig({ formConfig, loadRow });
        const product: Product = { available: true, category: 'Tools', id: 1, name: 'Hammer', price: 12.5 };

        config.tableConfig?.loadRow(product, BeyPageViewMode.Table);

        expect(loadRow).toHaveBeenCalledWith(product, BeyPageViewMode.Table);
        expect(config.formConfig).toBe(formConfig);
    });
});
