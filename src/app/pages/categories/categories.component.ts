import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BeyPageComponent } from '@beyonda-labs/angular-components';

import { buildCategoriesPageConfig } from './categories-page-config';
import { CategoryFormService } from './services/category-form.service';
import { CategoryTableService } from './services/category-table.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [BeyPageComponent],
    selector: 'app-categories',
    templateUrl: './categories.component.html'
})
export class CategoriesComponent {
    private readonly categoryFormService = inject(CategoryFormService);
    private readonly categoryTableService = inject(CategoryTableService);

    readonly categoriesPageConfig = buildCategoriesPageConfig({
        categoryFormConfig: this.categoryFormService.buildCategoryFormConfig(),
        formConfig: this.categoryFormService.buildItemFormConfig(),
        loadRow: item => this.categoryTableService.loadRow(item)
    });
}
