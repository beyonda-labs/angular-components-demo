import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    BeyFormNumberField,
    BeyFormRow,
    BeyFormSection,
    BeyFormTextField,
    BeyHeaderActionType,
    BeyPageAction,
    BeyPageActionScope,
    BeyPageActionZone,
    BeyPageCategoriesConfig,
    BeyPageComponent,
    BeyPageConfig,
    BeyPageFormConfig,
    BeyPageHeaderConfig,
    BeyPageStandardAction,
    BeyPageTableConfig,
    BeyPageTableSearchConfig,
    BeySearchField,
    BeySearchFieldType,
    BeyTableColumn,
    BeyTextTableCell
} from '@beyonda-labs/angular-components';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { formatPrice } from '../../shared/format-price';
import { Category, CategoryFormValue, CategoryItem, CategoryItemFormValue } from './models/category.model';

const PREFIX = 'angular-components-demo.categories';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [BeyPageComponent],
    selector: 'app-categories',
    templateUrl: './categories.component.html'
})
export class CategoriesComponent {
    readonly config = new BeyPageConfig<CategoryItemFormValue, CategoryItem, Category>({
        baseUrl: '/product-categories',
        formConfig: buildItemFormConfig(),
        headerConfig: new BeyPageHeaderConfig({ actions: buildActions(), title: `${PREFIX}.title` }),
        prefix: PREFIX,
        tableConfig: new BeyPageTableConfig({
            categoriesConfig: new BeyPageCategoriesConfig<Category>({
                formConfig: buildCategoryFormConfig(),
                useTrash: true
            }),
            columns: [new BeyTableColumn({ key: 'name', width: 8 }), new BeyTableColumn({ key: 'price', width: 4 })],
            height: 'calc(100vh - 320px)',
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

function buildActions(): BeyPageAction<CategoryItem>[] {
    return [
        new BeyPageAction({
            icon: faPlus,
            key: 'create-group',
            scope: BeyPageActionScope.Group,
            subActions: [
                new BeyPageAction({
                    key: BeyPageStandardAction.Create,
                    scope: BeyPageActionScope.Global,
                    type: BeyHeaderActionType.Text,
                    zone: BeyPageActionZone.Right
                }),
                new BeyPageAction({
                    key: BeyPageStandardAction.CreateCategory,
                    scope: BeyPageActionScope.Global,
                    type: BeyHeaderActionType.Text,
                    zone: BeyPageActionZone.Right
                })
            ],
            type: BeyHeaderActionType.PrimaryButton,
            zone: BeyPageActionZone.Right
        }),
        new BeyPageAction({
            key: BeyPageStandardAction.Edit,
            scope: BeyPageActionScope.Single,
            zone: BeyPageActionZone.Left
        }),
        new BeyPageAction({
            key: BeyPageStandardAction.EditCategory,
            scope: BeyPageActionScope.Single,
            zone: BeyPageActionZone.Left
        }),
        new BeyPageAction({
            key: BeyPageStandardAction.Move,
            scope: BeyPageActionScope.Item,
            zone: BeyPageActionZone.Menu
        }),
        new BeyPageAction({
            key: BeyPageStandardAction.Delete,
            scope: BeyPageActionScope.Item,
            zone: BeyPageActionZone.Menu
        }),
        new BeyPageAction({
            key: BeyPageStandardAction.DeleteCategory,
            scope: BeyPageActionScope.Item,
            zone: BeyPageActionZone.Menu
        }),
        new BeyPageAction({
            key: BeyPageStandardAction.RestoreTrashItem,
            scope: BeyPageActionScope.Item,
            zone: BeyPageActionZone.Left
        }),
        new BeyPageAction({
            key: BeyPageStandardAction.DeleteTrashItem,
            scope: BeyPageActionScope.Item,
            zone: BeyPageActionZone.Menu
        })
    ];
}

function buildCategoryFormConfig(): BeyPageFormConfig<unknown, Category> {
    return new BeyPageFormConfig<unknown, Category>({
        buildSections: () => [
            new BeyFormSection({
                isTitleVisible: false,
                key: 'category',
                rows: [
                    new BeyFormRow({ fields: [new BeyFormTextField({ columns: 12, isRequired: true, key: 'name' })] })
                ]
            })
        ],
        prefix: `${PREFIX}.category-form`,
        toFormValue: category => (category ? { category: { name: category.name } } : undefined),
        toItem: value => ({ name: (value as CategoryFormValue).category.name })
    });
}

function buildItemFormConfig(): BeyPageFormConfig<CategoryItemFormValue, CategoryItem> {
    return new BeyPageFormConfig<CategoryItemFormValue, CategoryItem>({
        buildSections: () => [
            new BeyFormSection({
                isTitleVisible: false,
                key: 'item',
                rows: [
                    new BeyFormRow({
                        fields: [
                            new BeyFormTextField({ columns: 6, isRequired: true, key: 'name' }),
                            new BeyFormNumberField({ columns: 6, isRequired: true, key: 'price', min: 0 })
                        ]
                    })
                ]
            })
        ],
        prefix: `${PREFIX}.form`,
        toFormValue: item => (item ? toItemFormValue(item) : undefined),
        toItem: value => {
            const { name, price } = value.item;

            return { name, price };
        }
    });
}

function loadRow({ name, price }: CategoryItem): BeyTextTableCell[] {
    return [
        new BeyTextTableCell({ content: name ?? '', tooltip: name ?? '' }),
        new BeyTextTableCell({ content: formatPrice(price) })
    ];
}

function toItemFormValue({ name, price }: CategoryItem): CategoryItemFormValue {
    return { item: { name, price } };
}
