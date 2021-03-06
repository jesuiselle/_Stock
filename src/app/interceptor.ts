import {Injectable} from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest, HttpErrorResponse
} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

/**
 * Pass untouched request through to the next request handler.
 **/
@Injectable()
export class ServerInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const auxReq = req.clone({
            url: `http://localhost:3000${req.url}`
        });
        return next.handle(auxReq).pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                    errorMessage = `Client side error Message: ${error.error.message}`;
                } else {
                    errorMessage = `Server side error Message: ${error.message}`;
                }
                alert(errorMessage);
                return throwError(errorMessage);
            })
        );
    }
}
