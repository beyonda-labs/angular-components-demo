import { Injectable } from '@angular/core';
import {
    BeyFormNumberField,
    BeyFormRow,
    BeyFormSection,
    BeyFormTextField,
    BeyPageFormConfig
} from '@beyonda-labs/angular-components';

import { Category, CategoryFormValue, CategoryItem, CategoryItemFormValue } from '../models/category.model';

const PREFIX = 'angular-components-demo.categories';

@Injectable({
    providedIn: 'root'
})
export class CategoryFormService {
    buildCategoryFormConfig(): BeyPageFormConfig<CategoryFormValue, Category> {
        return new BeyPageFormConfig<CategoryFormValue, Category>({
            buildSections: () => [
                new BeyFormSection({
                    isTitleVisible: false,
                    key: 'category',
                    rows: [
                        new BeyFormRow({
                            fields: [new BeyFormTextField({ columns: 12, isRequired: true, key: 'name' })]
                        })
                    ]
                })
            ],
            prefix: `${PREFIX}.category-form`,
            toFormValue: category => (category ? { category: { name: category.name } } : undefined),
            toItem: value => ({ name: value.category.name })
        });
    }

    buildItemFormConfig(): BeyPageFormConfig<CategoryItemFormValue, CategoryItem> {
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
}

function toItemFormValue({ name, price }: CategoryItem): CategoryItemFormValue {
    return { item: { name, price } };
}
