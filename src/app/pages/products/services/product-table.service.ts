import { Injectable } from '@angular/core';
import { BeyTableCell, BeyTextTableCell } from '@beyonda-labs/angular-components';

import { formatPrice } from '../../../shared/functions/format-price';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductTableService {
    loadRow({ category, name, price }: Product): BeyTableCell[] {
        return [
            new BeyTextTableCell({ content: name ?? '', tooltip: name ?? '' }),
            new BeyTextTableCell({ content: category ?? '', tooltip: category ?? '' }),
            new BeyTextTableCell({ content: formatPrice(price) })
        ];
    }
}
