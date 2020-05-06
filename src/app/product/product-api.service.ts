import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductListResponse } from 'src/entities/product-list-response.entity';
import { ProductDetailResponse } from 'src/entities/product-detail-response.entity';
import { environment } from 'src/environments/environment';

/**
 * Administra peticiones del módulo product.
 */
@Injectable({
    providedIn: 'root'
})
export class ProductApiService {

    private baseUrl: string = `${environment.challengeApiProtocol}${environment.challengeApiDomain}:${environment.challengeApiPort}`;

    /**
     * Creates an instance of product api service.
     * @param httpClient Administra operaciones de peticiones HTTP.
     */
    constructor(
        private httpClient: HttpClient
    ) {

    }

    /**
     * Obtiene una lista de productos mediante una texto de búsqueda.
     * @param searchText Texto de la búsqueda.
     * @returns Lista de productos.
     */
    public getProductListBySearchText(searchText: string): Observable<ProductListResponse> {
        const url: string = `${this.baseUrl}/api/items?q=${searchText}`;
        return this.httpClient.get<ProductListResponse>(url);
    }

    /**
     * Obtiene el detalle de un producto mediante su id.
     * @param id Id del producto.
     * @returns Detalle de un producto.
     */
    public getProductById(id: string): Observable<ProductDetailResponse> {
        const url: string = `${this.baseUrl}/api/items/${id}`;
        return this.httpClient.get<ProductDetailResponse>(url);
    }
}
