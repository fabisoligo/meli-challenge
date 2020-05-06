import { ProductPreview } from './product-preview.entity';
import { ProductCategory } from './product-category.entity';

/**
 * Detalle de un producto.
 */
export interface ProductDetail extends ProductPreview {

    /** Descripción. */
    description: string;

    /** Cantidad de ventas. */
    sold_quantity: number;
}
