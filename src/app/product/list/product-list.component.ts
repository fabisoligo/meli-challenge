import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import * as actions from '../store/product.actions';
import { SharedHelperService } from 'src/app/shared/shared-helper.service';
import { Observable, Subject } from 'rxjs';
import { AppStateModel } from 'src/app/store/app.state-model';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, map, filter } from 'rxjs/operators';
import { Title, StateKey, makeStateKey, TransferState } from '@angular/platform-browser';
import { ProductPreview } from 'src/entities/product-preview.entity';
import { ProductStateModel } from '../store/product.state-model';
import { ProductListResponse } from 'src/entities/product-list-response.entity';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {

    /** Referencia para desuscribir observables del componente. */
    private destroy$: Subject<boolean> = new Subject<boolean>();

    /** Lista de previsualizaciones de productos. */
    public productList: ProductPreview[];

    /** Breadcumb de navegación. */
    public breadcumb: string[];

    /** Texto de bùsqueda. */
    public searchText: string;

    /** True si la app está cargando información. False de lo contrario. */
    @Select((state: AppStateModel) => state.shared.loading)
    public loading$: Observable<boolean>;

    /** Clave para transferir el estado de la lista de productos en server side rendering. */
    private PRODUCT_LIST_STATE_KEY: StateKey<ProductPreview[]> = makeStateKey('product-list-ssr');

    /** Clave para transferir el estado del breadcumb en server side rendering. */
    private BREADCUMB_STATE_KEY: StateKey<string[]> = makeStateKey('breadcumb-ssr');

    /** Clave para transferir el estado de la búsqueda en server side rendering. */
    private SEARCH_STATE_KEY: StateKey<string[]> = makeStateKey('search-ssr');

    /**
     * Creates an instance of product list component.
     * @param sharedHelperService Herramientas compartidas de la app.
     * @param activatedRoute Administra operaciones de la ruta activa.
     * @param store Administra operaciones para manejar el estado de la app.
     * @param title Administra operaciones sobre el título del documento.
     * @param transferState Administra operaciones de transferencias de estados.
     * @param platformId Administra información sobre la plataforma en ejecución.
     */
    constructor(
        public sharedHelperService: SharedHelperService,
        private activatedRoute: ActivatedRoute,
        private store: Store,
        private title: Title,
        private transferState: TransferState,
        // tslint:disable-next-line: ban-types
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    /**
     * Evento de inicialización del componente.
     */
    public ngOnInit(): void {

        if (isPlatformBrowser(this.platformId)) {

            const productListState: ProductPreview[] = this.transferState.get<ProductPreview[]>(this.PRODUCT_LIST_STATE_KEY, null);
            const breadcumbState: string[] = this.transferState.get<string[]>(this.BREADCUMB_STATE_KEY, null);
            const searchState: string = this.transferState.get<string>(this.SEARCH_STATE_KEY, null);

            if (productListState || breadcumbState) {
                this.productList = productListState;
                this.breadcumb = breadcumbState;
                this.searchText = searchState;

                // Completa el state.
                const responseListSSR: ProductListResponse = {
                    categories: this.breadcumb,
                    items: this.productList
                };

                this.store.dispatch(new actions.GetProductListBySearchTextSuccessAction(responseListSSR));
                this.store.dispatch(new actions.SetSearchTextAction(searchState));
                this.transferState.set<ProductPreview[]>(this.PRODUCT_LIST_STATE_KEY, null);
                this.transferState.set<string[]>(this.BREADCUMB_STATE_KEY, null);
            }
        }

        this.store.select((state: AppStateModel) => state.product)
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.searchText !== this.activatedRoute.snapshot.queryParams.search))
            .subscribe((productState: ProductStateModel) => {

                this.productList = productState.list;
                this.breadcumb = productState.breadcumb;

                // Sólo se guarda el estado en el servidor para mantener información fresca en el cliente.
                if (isPlatformServer(this.platformId)) {
                    this.transferState.set<ProductPreview[]>(this.PRODUCT_LIST_STATE_KEY, productState.list);
                    this.transferState.set<string[]>(this.BREADCUMB_STATE_KEY, productState.breadcumb);
                }
            });

        this.activatedRoute.queryParams
            .pipe(
                takeUntil(this.destroy$),
                map((queryParams: { [key: string]: string }) => queryParams.search),
                filter((search: string) => this.searchText !== search)
            )
            .subscribe((search: string) => {

                this.store.dispatch(new actions.SetSearchTextAction(search));
                this.store.dispatch(new actions.CleanBreadcumbAction());
                this.store.dispatch(new actions.GetProductListBySearchTextAction());
                this.title.setTitle(`Challenge | Resultados | ${search}`);

                // Sólo se guarda el estado en el servidor para mantener información fresca en el cliente.
                if (isPlatformServer(this.platformId)) {
                    this.transferState.set<string>(this.SEARCH_STATE_KEY, search);
                }
            });
    }

    /**
     * Evento de destrucción del componente.
     */
    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
