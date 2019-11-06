import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from "@app/+shared/_services/auth.service";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    return <any> next.handle(authRequest);
  }
}
