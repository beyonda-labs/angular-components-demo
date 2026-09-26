import { ChangeDetectionStrategy, Component } from '@angular/core';
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
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { formatPrice } from '../../shared/format-price';
import { Product, ProductFormValue } from './models/product.model';

const PREFIX = 'angular-components-demo.products';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [BeyPageComponent],
    selector: 'app-products',
    templateUrl: './products.component.html'
})
export class ProductsComponent {
    readonly config = new BeyPageConfig({
        baseUrl: '/products',
        formConfig: buildFormConfig(),
        headerConfig: new BeyPageHeaderConfig({
            actions: [
                new BeyPageAction({
                    icon: faPlus,
                    key: BeyPageStandardAction.Create,
                    scope: BeyPageActionScope.Global,
                    type: BeyHeaderActionType.PrimaryButton,
                    zone: BeyPageActionZone.Right
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

function buildFormConfig(): BeyPageFormConfig {
    return new BeyPageFormConfig<unknown>({
        buildSections: item => {
            const secondaryFields: BeyFormField[] = [
                new BeyFormNumberField({ columns: 6, isRequired: true, key: 'price', min: 0 })
            ];

            if (item) {
                secondaryFields.push(new BeyFormCheckboxField({ columns: 6, key: 'available' }));
            }

            return [
                new BeyFormSection({
                    isTitleVisible: false,
                    key: 'product',
                    rows: [
                        new BeyFormRow({
                            fields: [
                                new BeyFormTextField({ columns: 6, isRequired: true, key: 'name' }),
                                new BeyFormTextField({ columns: 6, isRequired: true, key: 'category' })
                            ]
                        }),
                        new BeyFormRow({ fields: secondaryFields })
                    ]
                })
            ];
        },
        prefix: `${PREFIX}.form`,
        toFormValue: item => (item ? toFormValue(item as unknown as Product) : undefined),
        toItem: value => toItem(value as ProductFormValue)
    });
}

function loadRow(pageItem: BeyPageItem): BeyTextTableCell[] {
    const { category, name, price } = pageItem as unknown as Product;

    return [
        new BeyTextTableCell({ content: name ?? '', tooltip: name ?? '' }),
        new BeyTextTableCell({ content: category ?? '', tooltip: category ?? '' }),
        new BeyTextTableCell({ content: formatPrice(price) })
    ];
}

function toFormValue({ available, category, name, price }: Product): ProductFormValue {
    return { product: { available: Boolean(available), category, name, price } };
}

function toItem({ product }: ProductFormValue): Partial<Product> {
    const { available, category, name, price } = product;

    return available === undefined || available === null
        ? { category, name, price }
        : { available: Boolean(available), category, name, price };
}
