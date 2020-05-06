import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

/**
 * Intercepta las peticiones HTTP y maneja los errores.
 */
@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

  /**
   * Intercepta peticiones HTTP y loguea los errores.
   * @param request petición HTTP.
   * @param next Próximo manejador de la petición HTTP.
   * @returns Observable con la llamada al próximo manejador de la petición HTTP manipulada.
   */
  // tslint:disable-next-line:no-any
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(err => this.logError(err)));
  }

  /**
   * Loguea error en BD.
   * @param error Error de app.
   * @returns Error de app.
   */
  private logError(error: HttpErrorResponse): Observable<never> {
    console.error(error);
    return throwError(error);
  }
}
