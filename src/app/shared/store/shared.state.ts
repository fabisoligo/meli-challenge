import { State, Action, StateContext } from '@ngxs/store';
import { SharedStateModel } from './shared.state-model';
import { sharedStateKey } from 'src/app/store/app.state-model';
import { Injectable } from '@angular/core';
import * as actions from './shared.actions';

/**
 * Implementa las acciones del módulo shared.
 */
@State<SharedStateModel>({
    name: sharedStateKey,
    defaults: { loading: false }
})
@Injectable()
export class SharedState {

    /**
     * Indica que la app está cargando información.
     * @param state Estado de la app.
     */
    @Action(actions.LoadingInitAction)
    public loadingInitAction({ patchState }: StateContext<SharedStateModel>): void {
        patchState({ loading: true });
    }

    /**
     * Indica que la app terminó de cargar información.
     * @param state Estado de la app.
     */
    @Action(actions.LoadingCompleteAction)
    public loadingCompleteAction({ patchState }: StateContext<SharedStateModel>): void {
        patchState({ loading: false });
    }
}
