import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthorInterceptor implements HttpInterceptor {

  constructor() { }

  /**
   * Intercepta y manipula peticiones HTTP.
   * @param request petición HTTP.
   * @param next Próximo manejador de la petición HTTP.
   * @returns Observable con la llamada al próximo manejador de la petición HTTP manipulada.
   */
  // tslint:disable-next-line:no-any
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.indexOf('api/') > -1) {
      req = req.clone({
        setHeaders: {
          name: 'Fabián',
          lastname: 'Soligo'
        }
      });
    }
    return next.handle(req);
  }
}
