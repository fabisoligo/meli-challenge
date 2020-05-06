import { Author } from './author.entity';

/**
 * Datos genéricos de la respuesta de productos.
 */
export interface ProductResponse {

    /** Autor de la petición. */
    author?: Author;

    /** Ruta de las categorías del producto. */
    categories: string[];
}
