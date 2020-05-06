import { ProductListResponse } from 'src/entities/product-list-response.entity';
import { ProductDetailResponse } from 'src/entities/product-detail-response.entity';

/**
 * Setea el texto de búsqueda.
 */
export class SetSearchTextAction {

    /** Identificador de la acción. */
    static readonly type = 'get search text';

    constructor(public searchedText: string) { }
}

/**
 * Obtiene una lista de productos mediante una texto de búsqueda.
 */
export class GetProductListBySearchTextAction {

    /** Identificador de la acción. */
    static readonly type = 'get product list by text search';

    constructor() { }
}

/**
 * Obtiene una lista de productos mediante una texto de búsqueda (success).
 */
export class GetProductListBySearchTextSuccessAction {

    /** Identificador de la acción. */
    static readonly type = 'get product list by text search success';

    constructor(public response: ProductListResponse) { }
}

/**
 * Obtiene el detalle de un producto mediante su id.
 */
export class GetProductByIdAction {

    /** Identificador de la acción. */
    static readonly type = 'get product by id';

    constructor(public productId: string) { }
}

/**
 * Obtiene el detalle de un producto mediante su id (success).
 */
export class GetProductByIdSuccessAction {

    /** Identificador de la acción. */
    static readonly type = 'get product by id success';

    constructor(public response: ProductDetailResponse) { }
}

/**
 * Vacía el breadcumb.
 */
export class CleanBreadcumbAction {

    /** Identificador de la acción. */
    static readonly type = 'clean breadcumb';

    constructor() { }
}
