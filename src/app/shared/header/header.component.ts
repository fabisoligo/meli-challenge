import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { productsPath } from 'src/app/config/routes.config';
import { Subject } from 'rxjs';
import { distinct, map, takeUntil, takeWhile, switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

    /** Referencia para desuscribir observables del componente. */
    private destroy$: Subject<boolean> = new Subject<boolean>();

    /** Formulario de búsqueda. */
    public searchForm: FormGroup;

    /**
     * Creates an instance of header component.
     * @param formBuilder Administra operaciones para implementar formularios reactivos.
     * @param activatedRoute Administra operaciones de la ruta activa.
     * @param store Administra operaciones para manejar el estado de la app.
     */
    constructor(
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private store: Store) { }

    /**
     * Evento de inicialización del componente.
     */
    public ngOnInit(): void {

        this.buildForm();

        this.activatedRoute.queryParamMap
            .pipe(
                takeUntil(this.destroy$),
                map((queryParams) => queryParams.get('search')),
                distinct()
            )
            .subscribe((search: string) => {
                this.searchForm.setValue({ search });
            });
    }

    /**
     * Evento de destrucción del componente.
     */
    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Ejecuta la búsqueda de productos mediante un texto.
     */
    public sendSearch(): void {
        const search: string = this.searchForm.value.search;
        this.store.dispatch(new Navigate([`/${productsPath}`], { search }));
    }

    /**
     * Configura los campos del formulario reactivo.
     */
    private buildForm(): void {
        this.searchForm = this.formBuilder.group({
            search: [null, Validators.required]
        });
    }

}
