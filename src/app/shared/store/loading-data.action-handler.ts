import { Injectable } from '@angular/core';
import { Actions, ofActionDispatched, Store, ofActionCompleted } from '@ngxs/store';
import { LoadingInitAction, LoadingCompleteAction } from './shared.actions';
import { GetProductListBySearchTextAction, GetProductByIdAction } from 'src/app/product/store/product.actions';

/**
 * Escucha acciones específicas de la app para indicar si la app está ejecutando acciones que requieren espera.
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingActionHandler {

  /** Acciones que ejecutan peticiones asincrónicas. */
  private loadingActions = [
    GetProductListBySearchTextAction,
    GetProductByIdAction
  ];

  /**
   * Creates an instance of loading data action handler.
   * @param actions$ Flujo de acciones que se disparan en la app.
   * @param store Estado general de la app.
   */
  constructor(
    private actions$: Actions,
    private store: Store) {

    // Acciones de inicio de espera.
    this.actions$
      .pipe(
        ofActionDispatched(...this.loadingActions))
      .subscribe(() => this.store.dispatch(new LoadingInitAction()));

    // Acciones de finalización de espera.
    this.actions$
      .pipe(
        ofActionCompleted(...this.loadingActions))
      .subscribe(() => this.store.dispatch(new LoadingCompleteAction()));
  }
}
