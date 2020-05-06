import { ProductResponse } from './product-response.entity';
import { ProductDetail } from './product-detail.entity';

/**
 * Respuesta de la petición que obtiene el detalle de un producto.
 */
export interface ProductDetailResponse extends ProductResponse {

    /** Detalle del producto. */
    item: ProductDetail;
}
