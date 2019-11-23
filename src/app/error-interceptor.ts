import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorComponent } from '@app/+shared/components/error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('  ErrorInterceptor req ', req);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('ErrorInterceptor ', error);
        let errorMessage = 'An unknown error occurred! ';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, {data: { message : errorMessage}});
        return throwError(error);
      })
    );
  }

}
