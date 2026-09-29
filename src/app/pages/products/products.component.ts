import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BeyPageComponent } from '@beyonda-labs/angular-components';

import { buildProductsPageConfig } from './products-page-config';
import { ProductFormService } from './services/product-form.service';
import { ProductTableService } from './services/product-table.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [BeyPageComponent],
    selector: 'app-products',
    templateUrl: './products.component.html'
})
export class ProductsComponent {
    private readonly productFormService = inject(ProductFormService);
    private readonly productTableService = inject(ProductTableService);

    readonly productsPageConfig = buildProductsPageConfig({
        formConfig: this.productFormService.buildFormConfig(),
        loadRow: product => this.productTableService.loadRow(product)
    });
}
