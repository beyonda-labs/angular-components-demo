export interface CategoryRecord {
    name: string;
    type: string;

    price?: number;
}

export interface CategoryFormValue {
    category: {
        name: string;
    };
}

export interface CategoryItemFormValue {
    item: {
        name: string;
        price: number;
    };
}
