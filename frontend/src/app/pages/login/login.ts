import { Component } from '@angular/core';
import { DefaultLoginLayout } from '../../component/default-login-layout/default-login-layout';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { PrimaryInput } from '../../component/primary-input/primary-input';
import { Router } from '@angular/router';
import { Login } from '../../services/login';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [ DefaultLoginLayout, PrimaryInput, ReactiveFormsModule],

  providers: [
    Login
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
loginForm!:FormGroup;
  
  constructor ( 
    private router: Router,
    private loginService: Login,
    private toastService: ToastrService
  ){ 
    this.loginForm = new FormGroup({
      email:new FormControl('', [Validators.required, Validators.email]),
      password:new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  submit() {
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next : () => {
        this.toastService.success('Login feito com sucesso!');
        this.router.navigate(['/dashboard/upload']);
      },
      error : () => this.toastService.error('Erro Inesperado! Tente novamente mais tarde.')
    })
  }  

  navigate(){
      this.router.navigate(['signup']);
    }
}
  