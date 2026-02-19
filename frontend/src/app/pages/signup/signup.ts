import { Component } from '@angular/core';
import { DefaultLoginLayout } from '../../components/default-login-layout/default-login-layout';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { PrimaryInput } from '../../components/primary-input/primary-input';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register';
import { ToastrService } from 'ngx-toastr';
import { LoginComponent } from '../login/login';

interface SignupForm {
  name: FormControl;
  email: FormControl;
  password: FormControl;
  passwordConfirm: FormControl;
}

@Component({
  selector: 'app-signup',
  imports: [ DefaultLoginLayout, PrimaryInput, ReactiveFormsModule],

  providers: [
    RegisterService
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupComponent {
  signupForm!:FormGroup<SignupForm>;
  
  constructor ( 
    private router: Router,
    private registerService: RegisterService,
    private toastService: ToastrService
  ){ 
    this.signupForm = new FormGroup({
      name:new FormControl('', [Validators.required, Validators.minLength(3)]),
      email:new FormControl('', [Validators.required, Validators.email]),
      password:new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm:new FormControl('', [Validators.required, Validators.minLength(6)])

    });
  }

  submit() {
    if (this.signupForm.value.password !== this.signupForm.value.passwordConfirm) {
      this.toastService.error('As senhas não coincidem');
      return;
    }
    
    this.registerService.register(
      this.signupForm.value.email, 
      this.signupForm.value.password, 
      'user'
    ).subscribe({
      next : () => {
        this.toastService.success('Usuário criado com sucesso!');
        this.router.navigate(['login']);
      },
      error : () => this.toastService.error('Erro ao criar usuário. Tente novamente.')
    })
  }  


  navigate(){
      this.router.navigate(['login']);
    }
}
  