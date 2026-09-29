import { Injectable } from '@angular/core';
import {
    BeyFormCheckboxField,
    BeyFormField,
    BeyFormNumberField,
    BeyFormRow,
    BeyFormSection,
    BeyFormTextField,
    BeyPageFormConfig
} from '@beyonda-labs/angular-components';

import { Product, ProductFormValue } from '../models/product.model';

const PREFIX = 'angular-components-demo.products';

@Injectable({
    providedIn: 'root'
})
export class ProductFormService {
    buildFormConfig(): BeyPageFormConfig<ProductFormValue, Product> {
        return new BeyPageFormConfig<ProductFormValue, Product>({
            buildSections: product => {
                const secondaryFields: BeyFormField[] = [
                    new BeyFormNumberField({ columns: 6, isRequired: true, key: 'price', min: 0 })
                ];

                if (product) {
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
            toFormValue: product => (product ? toFormValue(product) : undefined),
            toItem: value => toItem(value)
        });
    }
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
