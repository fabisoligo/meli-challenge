import { Price } from './price.entity';

/**
 * Datos de previsualización de un producto.
 */
export interface ProductPreview {

    /** Id. */
    id: string;

    /** Título. */
    title: string;

    /** Precio. */
    price: Price;

    /** Foto. */
    picture: string;

    /** Condición (nuevo | usado). */
    condition: string;

    /** True si el envío es gratis. False de lo contrario. */
    free_shipping: boolean;

    /** True si el envío es gratis. False de lo contrario. */
    state_name: string;
}
