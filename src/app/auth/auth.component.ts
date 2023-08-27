import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { onErrorResumeNext } from 'rxjs-compat/operator/onErrorResumeNext';
import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error:string = null;

  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if (!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;
    this.isLoading = true;

    if (this.isLoginMode){
      authObs = this.authService.login(email,password);
    }
    else
    {
      authObs = this.authService.signup(email,password);
      form.reset();
    }
    authObs.subscribe(resData=>{
                                  console.log('hello' + resData);
                                  this.isLoading = false;
                                  this.router.navigate(['/recipes']);
                                },
                          err=>{
                                this.error = err
                                this.isLoading = false;
                               }); 
  }

}
