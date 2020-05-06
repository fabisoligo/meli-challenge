/**
 * Precio de un producto.
 */
export interface Price {

    /** Moneda. */
    currency: string;

    /** Valor (entero). */
    amount: number;

    /** Valor (decimal). */
    decimals: number;
}
