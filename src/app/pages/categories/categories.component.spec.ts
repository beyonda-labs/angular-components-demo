import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BeyPageItemType } from '@beyonda-labs/angular-components';
import {
    beyButtonByName,
    BeyFakeModalFormService,
    beyQueryAll,
    beyQueryButton,
    beyRenderComponent,
    beySettle,
    provideBeyTesting
} from '@beyonda-labs/angular-components/testing';

import { CategoriesComponent } from './categories.component';
import { Category, CategoryItem } from './models/category.model';

type StoredRow = (Category | CategoryItem) & { type: BeyPageItemType };

const CATEGORIES_URL = 'https://api.test/api/product-categories';
const PREFIX = 'angular-components-demo.categories';

describe('CategoriesComponent', () => {
    let fixture: ComponentFixture<CategoriesComponent>;
    let httpTesting: HttpTestingController;
    let modalFormService: BeyFakeModalFormService;

    function buildCategory(): StoredRow {
        return { actions: ['edit-category'], id: 2, name: 'Tools', type: BeyPageItemType.Category };
    }

    function buildItem(): StoredRow {
        return { actions: ['edit'], id: 1, name: 'Hammer', price: 12.5, type: BeyPageItemType.Item };
    }

    async function openEditForm(rowName: string, action: string): Promise<unknown> {
        rowNamed(rowName).click();
        await beySettle(fixture);
        beyButtonByName(fixture, `${PREFIX}.actions.${action}.label`).click();
        await beySettle(fixture);

        return modalFormService.forms().at(-1)?.initialValue;
    }

    async function render(results: StoredRow[] = [buildCategory(), buildItem()]): Promise<void> {
        fixture = await beyRenderComponent(CategoriesComponent);
        httpTesting.expectOne(request => request.url === CATEGORIES_URL).flush({ globalActions: [], results });
        await beySettle(fixture);
    }

    function rowNamed(name: string): HTMLElement {
        const row = beyQueryAll(fixture, '[role="row"]').find(candidate => candidate.textContent?.includes(name));

        if (!row) {
            throw new Error(`No row named ${name}`);
        }

        return row;
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CategoriesComponent],
            providers: [provideBeyTesting(), provideRouter([])]
        });
        httpTesting = TestBed.inject(HttpTestingController);
        modalFormService = TestBed.inject(BeyFakeModalFormService);
    });

    it('lists each category the backend returns as a link and each product with its price in euros', async () => {
        await render();

        expect(beyQueryButton(rowNamed('Tools'), 'Tools')).not.toBeNull();
        expect(rowNamed('Hammer').textContent).toContain('12.50 €');
    });

    it('opens the edit form with the values of the selected product', async () => {
        await render();

        expect(await openEditForm('Hammer', 'edit')).toEqual({ item: { name: 'Hammer', price: 12.5 } });
    });

    it('opens the category form with the name of the selected category', async () => {
        await render();

        expect(await openEditForm('Tools', 'edit-category')).toEqual({ category: { name: 'Tools' } });
    });
});
