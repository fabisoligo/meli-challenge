import { ProductPreview } from './product-preview.entity';
import { ProductResponse } from './product-response.entity';
import { ProductCategory } from './product-category.entity';

/**
 * Respuesta de la petición que obtiene un listado de productos.
 */
export interface ProductListResponse extends ProductResponse {

    /** Detalle de los productos. */
    items: ProductPreview[];
}
