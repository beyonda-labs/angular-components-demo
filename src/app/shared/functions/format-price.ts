export function formatPrice(price: number | undefined): string {
    return typeof price === 'number' ? `${price.toFixed(2)} €` : '';
}
