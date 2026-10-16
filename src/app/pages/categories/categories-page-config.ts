import {
    beyPageAddAction,
    BeyPageCategoriesConfig,
    BeyPageConfig,
    BeyPageHeaderConfig,
    BeyPageStandardAction,
    beyPageStandardAction,
    BeyPageTableConfig,
    BeyPageTableSearchConfig,
    BeySearchField,
    BeySearchFieldType,
    BeyTableColumn
} from '@beyonda-labs/angular-components';

import {
    CategoriesPageConfigOptions,
    Category,
    CategoryFormValue,
    CategoryItem,
    CategoryItemFormValue
} from './models/category.model';

const PREFIX = 'angular-components-demo.categories';

export function buildCategoriesPageConfig({
    categoryFormConfig,
    formConfig,
    loadRow
}: CategoriesPageConfigOptions): BeyPageConfig<CategoryItemFormValue, CategoryItem, Category, CategoryFormValue> {
    return new BeyPageConfig<CategoryItemFormValue, CategoryItem, Category, CategoryFormValue>({
        baseUrl: '/product-categories',
        formConfig,
        headerConfig: new BeyPageHeaderConfig({
            actions: [
                beyPageAddAction(),
                beyPageStandardAction(BeyPageStandardAction.Edit),
                beyPageStandardAction(BeyPageStandardAction.EditCategory),
                beyPageStandardAction(BeyPageStandardAction.Move),
                beyPageStandardAction(BeyPageStandardAction.Delete),
                beyPageStandardAction(BeyPageStandardAction.DeleteCategory),
                beyPageStandardAction(BeyPageStandardAction.RestoreTrashItem),
                beyPageStandardAction(BeyPageStandardAction.DeleteTrashItem)
            ],
            title: `${PREFIX}.title`
        }),
        prefix: PREFIX,
        tableConfig: new BeyPageTableConfig({
            categoriesConfig: new BeyPageCategoriesConfig<Category, CategoryFormValue>({
                formConfig: categoryFormConfig
            }),
            isTrashEnabled: true,
            columns: [new BeyTableColumn({ key: 'name', width: 8 }), new BeyTableColumn({ key: 'price', width: 4 })],
            loadRow,
            search: new BeyPageTableSearchConfig({
                fields: [
                    new BeySearchField({ key: 'name', type: BeySearchFieldType.Text }),
                    new BeySearchField({ key: 'price', type: BeySearchFieldType.Number })
                ],
                mainField: 'name'
            })
        })
    });
}
