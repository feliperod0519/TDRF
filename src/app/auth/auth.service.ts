import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

//Check in assets folder, documentation

export interface AuthResponseData{
  kind:string;
  idToken:string;
  email:string;
  refreshToken:string;
  expiresIn:string;
  localId:string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(new User('','','',new Date()));
  private tokenExpirationtimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signup(email:string,password:string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDJ8JwlF9-v4IRdus6nn0uCj37sUJpjhGI',
                            { email:email, password:password, returnSecureToken:true })
                            .pipe(catchError(this.handleError),
                                  tap(res=>{
                                    this.handleAuthentication(res.email,res.idToken,res.idToken,+res.expiresIn);
                                  }));
  }

  autoLogin(){
    const userData: { 
                      email: string;
                      id: string;
                      token: string;
                      expirationTimeStamp: number
                    }= JSON.parse(localStorage.getItem('userData') as string);
    if (!userData){
      return;
    }
    const loadedUser = new User(userData.email,userData.id,userData.token,new Date(userData.expirationTimeStamp));
    if (loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData.expirationTimeStamp).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }

  }

  autoLogout(expirationDuration:number){
    this.tokenExpirationtimer = setTimeout(()=>{
                                                    this.logout();
                                               },expirationDuration);
  }

  login(email:string, password:string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDJ8JwlF9-v4IRdus6nn0uCj37sUJpjhGI',
                    { email:email, password:password, returnSecureToken:true })
                    .pipe(catchError(this.handleError));

  }

  logout(){
    this.user.next(new User('','','',new Date()));
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationtimer){
      clearTimeout(this.tokenExpirationtimer);
    }
    this.tokenExpirationtimer = null;
  }

  private handleError(errorRes: HttpErrorResponse){
    let errorMessage = '';
    if (!errorRes.error || !errorRes.error.error){
      return throwError(errorMessage);
    }
    switch(errorRes.error.error.message){
      case 'EMAIL_EXISTS':
        errorMessage = "This email already exists";
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = "Email does not exist";
        break;
      case 'INVALID_PASSWORD':
        errorMessage = "Password is not correct";
        break;
      default:
        errorMessage = "Unknown error";
        break;
    }
    return throwError(errorMessage);
  }
  
  private handleAuthentication(email:string,id:string,token:string,expirationTimeStamp:number)
  {
    const expirationDate = new Date(new Date().getTime() + expirationTimeStamp * 1000);
    const user= new User(email,id,token,expirationDate);
    this.user.next(user);
    this.autoLogout(expirationTimeStamp* 1000)
    localStorage.setItem('userData',JSON.stringify(user));
  }
}
