import { ProductStateModel } from '../product/store/product.state-model';
import { RouterStateModel } from '@ngxs/router-plugin';
import { SharedStateModel } from '../shared/store/shared.state-model';

/**
 * Estado general de la app.
 */
export interface AppStateModel {

  /** Modelo que representa el estado del módulo product. */
  product: ProductStateModel;

  /** Modelo que representa el estado del módulo shared. */
  shared: SharedStateModel;

  /** Modelo que representa el estado del módulo router. */
  router: RouterStateModel;
}

/** Clave del módulo product en el store. */
export const productStateKey: string = 'product';

/** Clave del módulo shared en el store. */
export const sharedStateKey: string = 'shared';
