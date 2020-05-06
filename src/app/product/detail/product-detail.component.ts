import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import * as actions from '../store/product.actions';
import { SharedHelperService } from 'src/app/shared/shared-helper.service';
import { AppStateModel } from 'src/app/store/app.state-model';
import { Observable, Subject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, map, distinct, filter } from 'rxjs/operators';
import { Title, makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { ProductDetail } from 'src/entities/product-detail.entity';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ProductDetailResponse } from 'src/entities/product-detail-response.entity';
import { ProductStateModel } from '../store/product.state-model';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {

    /** Referencia para desuscribir observables del componente. */
    private destroy$: Subject<boolean> = new Subject<boolean>();

    /** Detalle del producto. */
    public productDetail: ProductDetail;

    /** Breadcumb de navegación. */
    public breadcumb: string[] = [];

    /** Identificador del producto. */
    private productId: string;

    /** True si la app está cargando información. False de lo contrario. */
    @Select((state: AppStateModel) => state.shared.loading)
    public loading$: Observable<boolean>;

    /** Clave para transferir el estado de server side rendering. */
    private PRODUCT_DETAIL_STATE_KEY: StateKey<ProductDetail> = makeStateKey('product-detail-sst');

    /** Clave para transferir el estado del breadcumb en server side rendering. */
    private BREADCUMB_STATE_KEY: StateKey<string[]> = makeStateKey('breadcumb-ssr');

    /**
     * Creates an instance of product detail component.
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

            const productDetailState: ProductDetail = this.transferState.get<ProductDetail>(this.PRODUCT_DETAIL_STATE_KEY, null);
            const breadcumbState: string[] = this.transferState.get<string[]>(this.BREADCUMB_STATE_KEY, null);

            if (productDetailState || breadcumbState) {
                this.productDetail = productDetailState;
                this.breadcumb = breadcumbState;
                this.productId = productDetailState.id;

                // Completa el state.
                const responseDetailSSR: ProductDetailResponse = {
                    categories: this.breadcumb,
                    item: this.productDetail
                };

                this.store.dispatch(new actions.GetProductByIdSuccessAction(responseDetailSSR));
                this.transferState.set<ProductDetail>(this.PRODUCT_DETAIL_STATE_KEY, null);
                this.transferState.set<string[]>(this.BREADCUMB_STATE_KEY, null);
            }
        }

        this.activatedRoute.params
            .pipe(
                takeUntil(this.destroy$),
                map((params: { [key: string]: string }) => params.id),
                filter((id: string) => !!id && this.productId !== id),
            ).subscribe((id: string) => {
                this.productId = id;
                this.store.dispatch(new actions.CleanBreadcumbAction());
                this.store.dispatch(new actions.GetProductByIdAction(this.productId));
            });

        this.store.select((state: AppStateModel) => state.product)
            .pipe(
                takeUntil(this.destroy$),
                filter((productState: ProductStateModel) => !!this.productId && !!productState.details[this.productId]
                    && (!this.productDetail || this.productDetail.id !== this.productId))
            ).subscribe((productState: ProductStateModel) => {

                this.productDetail = productState.details[this.productId];
                this.breadcumb = productState.breadcumb;
                this.title.setTitle(`Challenge | ${this.productDetail.title}`);

                // Sólo se guarda el estado en el servidor para mantener información fresca en el cliente.
                if (isPlatformServer(this.platformId)) {
                    this.transferState.set<ProductDetail>(this.PRODUCT_DETAIL_STATE_KEY, this.productDetail);
                    this.transferState.set<string[]>(this.BREADCUMB_STATE_KEY, productState.breadcumb);
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
