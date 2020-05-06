import { ProductPreview } from 'src/entities/product-preview.entity';
import { ProductDetail } from 'src/entities/product-detail.entity';

/**
 * Modelo del estado product.
 */
export interface ProductStateModel {

    /** Texto de búsqueda de productos. */
    searchedText: string;

    /** Lista de previsualizaciones de productos. */
    list: ProductPreview[];

    /** Breadcumb de navegación. */
    breadcumb: string[];

    /** Id del detalle de producto actual. */
    details: { [key: string]: ProductDetail };
}
