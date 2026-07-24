import { Component } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

import {
    BeyFormCheckboxField,
    BeyFormField,
    BeyFormNumberField,
    BeyFormRow,
    BeyFormSection,
    BeyFormTextField,
    BeyHeaderActionType,
    BeyPageAction,
    BeyPageActionScope,
    BeyPageActionZone,
    BeyPageComponent,
    BeyPageConfig,
    BeyPageFormConfig,
    BeyPageHeaderConfig,
    BeyPageItem,
    BeyPageStandardAction,
    BeyPageTableConfig,
    BeyPageTableSearchConfig,
    BeySearchField,
    BeySearchFieldType,
    BeySearchSortDirection,
    BeyTableColumn,
    BeyTextTableCell
} from '@beyonda-labs/angular-components';

const PREFIX = 'angular-components-demo.products';

@Component({
    selector: 'app-products',
    imports: [BeyPageComponent, TranslateModule],
    templateUrl: './products.component.html',
    standalone: true
})
export class ProductsComponent {
    readonly productsPageConfig = this.buildProductsPageConfig();

    private buildProductsPageConfig(): BeyPageConfig {
        return new BeyPageConfig({
            page: 'products',
            prefix: PREFIX,
            baseUrl: '/products',
            headerConfig: new BeyPageHeaderConfig({
                title: `${PREFIX}.title`,
                actions: [
                    new BeyPageAction({
                        key: BeyPageStandardAction.Create,
                        scope: BeyPageActionScope.Global,
                        type: BeyHeaderActionType.PrimaryButton,
                        zone: BeyPageActionZone.Right,
                        icon: faPlus
                    }),
                    new BeyPageAction({
                        key: BeyPageStandardAction.Edit,
                        scope: BeyPageActionScope.Item,
                        zone: BeyPageActionZone.Left
                    }),
                    new BeyPageAction({
                        key: BeyPageStandardAction.Delete,
                        scope: BeyPageActionScope.Item,
                        zone: BeyPageActionZone.Menu
                    })
                ]
            }),
            tableConfig: new BeyPageTableConfig({
                columns: [
                    new BeyTableColumn({ key: 'name', width: 4 }),
                    new BeyTableColumn({ key: 'category', width: 3 }),
                    new BeyTableColumn({ key: 'price', width: 2 })
                ],
                loadRow: item => this.loadProductRow(item),
                height: 'calc(100vh - 290px)',
                order: { field: 'name', direction: BeySearchSortDirection.Asc },
                search: new BeyPageTableSearchConfig({
                    mainField: 'name',
                    fields: [
                        new BeySearchField({ key: 'name', type: BeySearchFieldType.Text }),
                        new BeySearchField({ key: 'category', type: BeySearchFieldType.Text }),
                        new BeySearchField({ key: 'price', type: BeySearchFieldType.Number }),
                        new BeySearchField({ key: 'available', type: BeySearchFieldType.Boolean })
                    ]
                })
            }),
            formConfig: this.buildProductsFormConfig()
        });
    }

    private buildProductsFormConfig(): BeyPageFormConfig {
        return new BeyPageFormConfig<unknown>({
            prefix: `${PREFIX}.form`,
            buildSections: item => {
                const secondaryFields: BeyFormField[] = [
                    new BeyFormNumberField({ key: 'price', columns: 6, isRequired: true, min: 0 })
                ];

                if (item) {
                    secondaryFields.push(new BeyFormCheckboxField({ key: 'available', columns: 6 }));
                }

                return [
                    new BeyFormSection({
                        key: 'product',
                        isTitleVisible: false,
                        rows: [
                            new BeyFormRow({
                                fields: [
                                    new BeyFormTextField({ key: 'name', columns: 6, isRequired: true }),
                                    new BeyFormTextField({ key: 'category', columns: 6, isRequired: true })
                                ]
                            }),
                            new BeyFormRow({
                                fields: secondaryFields
                            })
                        ]
                    })
                ];
            },
            toFormValue: item => {
                if (!item) {
                    return undefined;
                }

                const product = item as unknown as {
                    available: number | boolean;
                    category: string;
                    name: string;
                    price: number;
                };

                return {
                    product: {
                        available: Boolean(product.available),
                        category: product.category,
                        name: product.name,
                        price: product.price
                    }
                };
            },
            toItem: value => {
                const { product } = value as {
                    product: { available?: boolean | null; category: string; name: string; price: number };
                };
                const item: Record<string, unknown> = {
                    category: product.category,
                    name: product.name,
                    price: product.price
                };

                if (product.available !== undefined && product.available !== null) {
                    item['available'] = Boolean(product.available);
                }

                return item;
            }
        });
    }

    private loadProductRow(pageItem: BeyPageItem): [BeyTextTableCell, BeyTextTableCell, BeyTextTableCell] {
        const item = pageItem as unknown as {
            name: string;
            category: string;
            price: number;
        };
        const price = item.price;

        return [
            new BeyTextTableCell({ content: item.name ?? '', tooltip: item.name ?? '' }),
            new BeyTextTableCell({ content: item.category ?? '', tooltip: item.category ?? '' }),
            new BeyTextTableCell({ content: typeof price === 'number' ? `${price.toFixed(2)} €` : '' })
        ];
    }
}
