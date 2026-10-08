import { BeyPageFormConfig, BeyPageStandardAction, BeyPageViewMode } from '@beyonda-labs/angular-components';

import { buildCategoriesPageConfig, CategoriesPageConfigOptions } from './categories-page-config';
import { Category, CategoryFormValue, CategoryItem, CategoryItemFormValue } from './models/category.model';

describe('buildCategoriesPageConfig', () => {
    let options: CategoriesPageConfigOptions;

    beforeEach(() => {
        options = {
            categoryFormConfig: new BeyPageFormConfig<CategoryFormValue, Category>({
                buildSections: () => [],
                prefix: 'angular-components-demo.categories.category-form'
            }),
            formConfig: new BeyPageFormConfig<CategoryItemFormValue, CategoryItem>({
                buildSections: () => [],
                prefix: 'angular-components-demo.categories.form'
            }),
            loadRow: jest.fn(() => [])
        };
    });

    it('offers the standard product, category and trash actions, with no handler of their own', () => {
        const actions = buildCategoriesPageConfig(options).headerConfig?.actions ?? [];

        expect(actions.map(action => [action.key, action.handler])).toEqual([
            ['add-group', undefined],
            [BeyPageStandardAction.Edit, undefined],
            [BeyPageStandardAction.EditCategory, undefined],
            [BeyPageStandardAction.Move, undefined],
            [BeyPageStandardAction.Delete, undefined],
            [BeyPageStandardAction.DeleteCategory, undefined],
            [BeyPageStandardAction.RestoreTrashItem, undefined],
            [BeyPageStandardAction.DeleteTrashItem, undefined]
        ]);
    });

    it('groups the creation of a product and of a category under the add action', () => {
        const [addAction] = buildCategoriesPageConfig(options).headerConfig?.actions ?? [];

        expect(addAction.subActions?.map(action => action.key)).toEqual([
            BeyPageStandardAction.Create,
            BeyPageStandardAction.CreateCategory
        ]);
    });

    it('draws each product row with the given loader and edits with the given forms', () => {
        const config = buildCategoriesPageConfig(options);
        const item: CategoryItem = { id: 1, name: 'Hammer', price: 12.5 };

        config.tableConfig?.loadRow(item, BeyPageViewMode.Table);

        expect(options.loadRow).toHaveBeenCalledWith(item, BeyPageViewMode.Table);
        expect(config.formConfig).toBe(options.formConfig);
        expect(config.tableConfig?.categoriesConfig?.formConfig).toBe(options.categoryFormConfig);
    });

    it('keeps deleted products and categories in a trash', () => {
        expect(buildCategoriesPageConfig(options).tableConfig?.isTrashEnabled).toBe(true);
    });
});
