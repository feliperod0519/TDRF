import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpParams, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs'

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user=>{
        if (!user){
          return next.handle(req);
        }
        const modifiedRequest = req.clone({
                                            params: new HttpParams().set('auth',user.token as string)
                                          });
        return next.handle(modifiedRequest);
      })
    );
  }
}
