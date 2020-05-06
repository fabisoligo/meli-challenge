import { State, Action, StateContext } from '@ngxs/store';
import * as actions from './product.actions';
import { ProductStateModel } from './product.state-model';
import { productStateKey } from 'src/app/store/app.state-model';
import { Observable, throwError } from 'rxjs';
import { ProductApiService } from '../product-api.service';
import { mergeMap, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductListResponse } from 'src/entities/product-list-response.entity';
import { ProductDetailResponse } from 'src/entities/product-detail-response.entity';

@Injectable()
@State<ProductStateModel>({
    name: productStateKey,
    defaults: {
        searchedText: null,
        list: null,
        breadcumb: [],
        details: {}
    }
})
export class ProductState {

    /**
     * Creates an instance of product state.
     * @param store Administra operaciones para manejar el estado de la app.
     * @param productApiService Administra peticiones del módulo product.
     */
    constructor(private productApiService: ProductApiService) { }

    /**
     * Setea el texto de búsqueda.
     * @param  stateContext Estado de la app.
     * @param  action Acción que cambia el estado de la app.
     * @returns Carga del viaje.
     */
    @Action(actions.SetSearchTextAction)
    // tslint:disable-next-line:max-line-length
    public setSearchTextAction({ patchState }: StateContext<ProductStateModel>, { searchedText }: actions.SetSearchTextAction): void {
        patchState({ searchedText });
    }

    /**
     * Carga el detalle de un viaje.
     * @param  stateContext Estado de la app.
     * @returns Carga del viaje.
     */
    @Action(actions.GetProductListBySearchTextAction)
    // tslint:disable-next-line:max-line-length
    public productGetBySearchAction({ patchState, dispatch, getState }: StateContext<ProductStateModel>): Observable<void> {
        const state: ProductStateModel = getState();
        patchState({
            list: null
        });

        return this.productApiService.getProductListBySearchText(state.searchedText)
            .pipe(
                mergeMap((response: ProductListResponse) => dispatch(new actions.GetProductListBySearchTextSuccessAction(response))),
                catchError(this.handleGetProductListError)
            );
    }

    /**
     * Carga el detalle de un viaje (success).
     * @param  stateContext Estado de la app.
     * @param  action Acción que cambia el estado de la app.
     * @returns Carga del viaje.
     */
    @Action(actions.GetProductListBySearchTextSuccessAction)
    // tslint:disable-next-line:max-line-length
    public productGetBySearchSuccessAction({ patchState }: StateContext<ProductStateModel>, { response }: actions.GetProductListBySearchTextSuccessAction): void {

        patchState({
            list: [...response.items],
            breadcumb: [...response.categories]
        });
    }

    /**
     * Carga el detalle de un viaje.
     * @param  stateContext Estado de la app.
     * @returns Carga del viaje.
     */
    @Action(actions.GetProductByIdAction)
    // tslint:disable-next-line: max-line-length
    public getProductByIdAction({ dispatch, patchState, getState }: StateContext<ProductStateModel>, { productId }: actions.GetProductByIdAction): Observable<void> {
        const state: ProductStateModel = getState();
        patchState({
            details: {
                ...state.details,
                [productId]: null
            }
        });
        return this.productApiService.getProductById(productId).pipe(
            mergeMap((response: ProductDetailResponse) => dispatch(new actions.GetProductByIdSuccessAction(response))),
            catchError(this.handleGetProductDetailError)
        );
    }

    /**
     * Carga el detalle de un viaje (success).
     * @param  stateContext Estado de la app.
     * @param  action Acción que cambia el estado de la app.
     * @returns Carga del viaje.
     */
    @Action(actions.GetProductByIdSuccessAction)
    // tslint:disable-next-line:max-line-length
    public getProductByIdSuccessAction({ patchState, getState }: StateContext<ProductStateModel>, { response }: actions.GetProductByIdSuccessAction): void {
        const state: ProductStateModel = getState();

        patchState({
            details: {
                ...state.details,
                [response.item.id]: response.item
            },
            breadcumb: [...response.categories]
        });
    }

    /**
     * Vacía el breadcumb.
     * @param  stateContext Estado de la app.
     * @param  action Acción que cambia el estado de la app.
     * @returns Carga del viaje.
     */
    @Action(actions.CleanBreadcumbAction)
    // tslint:disable-next-line:max-line-length
    public cleanBreadcumbAction({ patchState }: StateContext<ProductStateModel>): void {
        patchState({ breadcumb: [] });
    }

    /**
     * Maneja el error de la petición que obtiene una lista de productos.
     * @param err Error de la petición.
     * @returns Error completo de la petición.
     */
    private handleGetProductListError(err: HttpErrorResponse): Observable<never> {
        return throwError(err);
    }

    /**
     * Maneja el error de la petición que obtiene una lista de productos.
     * @param err Error de la petición.
     * @returns Error completo de la petición.
     */
    private handleGetProductDetailError(err: HttpErrorResponse): Observable<never> {
        return throwError(err);
    }
}
