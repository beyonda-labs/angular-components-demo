import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
    beyButtonByName,
    BeyFakeModalFormService,
    beyQueryAll,
    beyRenderComponent,
    beySettle,
    provideBeyTesting
} from '@beyonda-labs/angular-components/testing';

import { Product } from './models/product.model';
import { ProductsComponent } from './products.component';

const PREFIX = 'angular-components-demo.products';
const PRODUCTS_URL = 'https://api.test/api/products';

describe('ProductsComponent', () => {
    let fixture: ComponentFixture<ProductsComponent>;
    let httpTesting: HttpTestingController;
    let modalFormService: BeyFakeModalFormService;

    function buildProduct(overrides: Partial<Product> = {}): Product {
        return {
            actions: ['edit', 'delete'],
            available: 1,
            category: 'Tools',
            id: 1,
            name: 'Hammer',
            price: 12.5,
            ...overrides
        };
    }

    async function render(results: Product[] = [buildProduct()]): Promise<void> {
        fixture = await beyRenderComponent(ProductsComponent);
        httpTesting.expectOne(request => request.url === PRODUCTS_URL).flush({ globalActions: ['create'], results });
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
            imports: [ProductsComponent],
            providers: [provideBeyTesting(), provideRouter([])]
        });
        httpTesting = TestBed.inject(HttpTestingController);
        modalFormService = TestBed.inject(BeyFakeModalFormService);
    });

    it('lists each product the backend returns with its category and its price in euros', async () => {
        await render([buildProduct(), buildProduct({ category: 'Garden', id: 2, name: 'Rake', price: undefined })]);

        expect(rowNamed('Hammer').textContent).toContain('Tools');
        expect(rowNamed('Hammer').textContent).toContain('12.50 €');
        expect(rowNamed('Rake').textContent).toContain('Garden');
        expect(rowNamed('Rake').textContent).not.toContain('€');
    });

    it('opens the edit form with the values of the selected product', async () => {
        await render();

        rowNamed('Hammer').click();
        await beySettle(fixture);
        beyButtonByName(fixture, `${PREFIX}.actions.edit.label`).click();
        await beySettle(fixture);

        expect(modalFormService.forms().at(-1)?.initialValue).toEqual({
            product: { available: true, category: 'Tools', name: 'Hammer', price: 12.5 }
        });
    });
});
