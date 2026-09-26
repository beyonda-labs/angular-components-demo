export interface Product {
    available: boolean | number;
    category: string;
    name: string;
    price: number;
}

export interface ProductFormValue {
    product: {
        category: string;
        name: string;
        price: number;

        available?: boolean | null;
    };
}
