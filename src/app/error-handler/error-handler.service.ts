import { Injectable, ErrorHandler } from '@angular/core';
import { ErrorMessage } from '../entities/error-message';

/**
 * Administra los errores no controlados.
 */
@Injectable()
export class ErrorHandlerService implements ErrorHandler {

    /**
     * Realiza el tratamiento genérico del error y muestra un mensaje asociado.
     * @param error Error.
     */
    public handleError(error: any): void {
        this.processError(error);
    }

    /**
     * Muestra un dialog de tipo alert con el mensaje especificado.
     */
    public showError(errorMessage: ErrorMessage): void {
        // TODO: Mostrar error.
        console.error(errorMessage);
    }

    /**
     * Procesa y completa información del error recibido.
     * @param statusMessage Error de aplicación.
     * @returns Error de aplicación completo.
     */
    private processError(error: ErrorMessage): void {
        let errorMesasge: ErrorMessage = error;
        if (!errorMesasge.text) {
            errorMesasge = this.processPosibleRuntimeException(error);
        }
        this.showError(errorMesasge);
    }

    /**
     * Procesa posibles errores de ejecución y devuelve la Excepcion. 
     */
    private processPosibleRuntimeException(error: any): ErrorMessage {
        const errorMessage: ErrorMessage = {
            title: 'Se ha producido un error',
            text: null,
            description: null,
            code: null
        };

        if (!error.text && !!error && !!error.stack) {
            errorMessage.text = error.message.toString();
            errorMessage.description = error.stack.toString();
        } else {
            errorMessage.text = 'Se ha producido un error desconocido.';
        }

        return errorMessage;
    }
}
