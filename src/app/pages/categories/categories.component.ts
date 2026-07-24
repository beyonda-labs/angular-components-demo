import { Component } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

import {
    BeyFormNumberField,
    BeyFormRow,
    BeyFormSection,
    BeyFormTextField,
    BeyHeaderActionType,
    BeyLinkTableCell,
    BeyPageAction,
    BeyPageActionScope,
    BeyPageActionZone,
    BeyPageCategoriesConfig,
    BeyPageComponent,
    BeyPageConfig,
    BeyPageFormConfig,
    BeyPageHeaderConfig,
    BeyPageItem,
    BeyPageItemType,
    BeyPageStandardAction,
    BeyPageTableConfig,
    BeyPageTableSearchConfig,
    BeySearchField,
    BeySearchFieldType,
    BeyTableCell,
    BeyTableColumn,
    BeyTextTableCell
} from '@beyonda-labs/angular-components';

const PREFIX = 'angular-components-demo.categories';

@Component({
    selector: 'app-categories',
    imports: [BeyPageComponent, TranslateModule],
    templateUrl: './categories.component.html',
    standalone: true
})
export class CategoriesComponent {
    private readonly categoriesConfig = new BeyPageCategoriesConfig({
        formConfig: this.buildCategoryFormConfig(),
        useTrash: true
    });

    readonly categoriesPageConfig = this.buildCategoriesPageConfig();

    private buildCategoriesPageConfig(): BeyPageConfig {
        return new BeyPageConfig({
            page: 'productCategories',
            prefix: PREFIX,
            baseUrl: '/product-categories',
            headerConfig: new BeyPageHeaderConfig({
                title: `${PREFIX}.title`,
                actions: [
                    new BeyPageAction({
                        key: 'createGroup',
                        scope: BeyPageActionScope.Group,
                        type: BeyHeaderActionType.PrimaryButton,
                        zone: BeyPageActionZone.Right,
                        icon: faPlus,
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
                        ]
                    }),
                    new BeyPageAction({
                        key: BeyPageStandardAction.Edit,
                        scope: BeyPageActionScope.Item,
                        zone: BeyPageActionZone.Left
                    }),
                    new BeyPageAction({
                        key: BeyPageStandardAction.EditCategory,
                        scope: BeyPageActionScope.Item,
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
                ]
            }),
            tableConfig: new BeyPageTableConfig({
                columns: [
                    new BeyTableColumn({ key: 'name', width: 8 }),
                    new BeyTableColumn({ key: 'price', width: 4 })
                ],
                loadRow: item => this.loadCategoryPageRow(item),
                height: 'calc(100vh - 320px)',
                categoriesConfig: this.categoriesConfig,
                search: new BeyPageTableSearchConfig({
                    mainField: 'name',
                    fields: [
                        new BeySearchField({ key: 'name', type: BeySearchFieldType.Text }),
                        new BeySearchField({ key: 'price', type: BeySearchFieldType.Number })
                    ]
                })
            }),
            formConfig: this.buildItemFormConfig()
        });
    }

    private buildItemFormConfig(): BeyPageFormConfig {
        return new BeyPageFormConfig<unknown>({
            prefix: `${PREFIX}.form`,
            buildSections: () => [
                new BeyFormSection({
                    key: 'item',
                    isTitleVisible: false,
                    rows: [
                        new BeyFormRow({
                            fields: [
                                new BeyFormTextField({ key: 'name', columns: 6, isRequired: true }),
                                new BeyFormNumberField({ key: 'price', columns: 6, isRequired: true, min: 0 })
                            ]
                        })
                    ]
                })
            ],
            toFormValue: item => {
                if (!item) {
                    return undefined;
                }

                const product = item as unknown as { name: string; price: number };

                return { item: { name: product.name, price: product.price } };
            },
            toItem: value => {
                const { item } = value as { item: { name: string; price: number } };

                return { name: item.name, price: item.price };
            }
        });
    }

    private buildCategoryFormConfig(): BeyPageFormConfig {
        return new BeyPageFormConfig<unknown>({
            prefix: `${PREFIX}.categoryForm`,
            buildSections: () => [
                new BeyFormSection({
                    key: 'category',
                    isTitleVisible: false,
                    rows: [
                        new BeyFormRow({
                            fields: [new BeyFormTextField({ key: 'name', columns: 12, isRequired: true })]
                        })
                    ]
                })
            ],
            toFormValue: item => {
                if (!item) {
                    return undefined;
                }

                const category = item as unknown as { name: string };

                return { category: { name: category.name } };
            },
            toItem: value => {
                const { category } = value as { category: { name: string } };

                return { name: category.name };
            }
        });
    }

    private loadCategoryPageRow(pageItem: BeyPageItem): BeyTableCell[] {
        const record = pageItem as unknown as { name: string; price?: number; type: string };

        if (record.type === BeyPageItemType.Category) {
            return [
                new BeyLinkTableCell({
                    content: record.name ?? '',
                    action: () => this.categoriesConfig.openCategory(pageItem)
                }),
                new BeyTextTableCell({ content: '' })
            ];
        }

        return [
            new BeyTextTableCell({ content: record.name ?? '', tooltip: record.name ?? '' }),
            new BeyTextTableCell({ content: typeof record.price === 'number' ? `${record.price.toFixed(2)} €` : '' })
        ];
    }
}
