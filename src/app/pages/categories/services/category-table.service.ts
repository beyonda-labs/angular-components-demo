import { Injectable } from '@angular/core';
import { BeyTableCell, BeyTextTableCell } from '@beyonda-labs/angular-components';

import { formatPrice } from '../../../shared/functions/format-price';
import { CategoryItem } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryTableService {
    loadRow({ name, price }: CategoryItem): BeyTableCell[] {
        return [
            new BeyTextTableCell({ content: name ?? '', tooltip: name ?? '' }),
            new BeyTextTableCell({ content: formatPrice(price) })
        ];
    }
}
