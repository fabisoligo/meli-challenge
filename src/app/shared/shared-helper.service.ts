import { Injectable } from '@angular/core';
import localeEsAR from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';

/**
 * Herramientas compartidas de la app.
 */
@Injectable({
    providedIn: 'root'
})
export class SharedHelperService {

    constructor() {
        // Define el idioma de la app.
        registerLocaleData(localeEsAR, 'es-AR');
    }

    /**
     * Devuelve un identificador único por cada item para facilitar la detección de cambios de angular.
     * @param idx Número de posición del item.
     * @param _item Item.
     * @returns Identificador único por item para facilitar la detección de cambios de angular.
     */
    public trackByFn(idx: number, item: any): string {
        const ret: string = `${idx}`;
        return ret;
    }

}
