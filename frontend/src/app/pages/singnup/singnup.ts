import { Component } from '@angular/core';
import { DefaultLoginLayout } from '../../component/default-login-layout/default-login-layout';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { PrimaryInput } from '../../component/primary-input/primary-input';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register';
import { ToastrService } from 'ngx-toastr';
import { LoginComponent } from '../login/login';

interface SingnupForm {
  name: FormControl;
  email: FormControl;
  password: FormControl;
  passwordConfirm: FormControl;
}

@Component({
  selector: 'app-singnup',
  imports: [ DefaultLoginLayout, PrimaryInput, ReactiveFormsModule],

  providers: [
    RegisterService
  ],
  templateUrl: './singnup.html',
  styleUrls: ['./singnup.scss'],
})
export class SingnupComponent {
  singupForm!:FormGroup<SingnupForm>;
  
  constructor ( 
    private router: Router,
    private registerService: RegisterService,
    private toastService: ToastrService
  ){ 
    this.singupForm = new FormGroup({
      name:new FormControl('', [Validators.required, Validators.minLength(3)]),
      email:new FormControl('', [Validators.required, Validators.email]),
      password:new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm:new FormControl('', [Validators.required, Validators.minLength(6)])

    });
  }

  submit() {
    if (this.singupForm.value.password !== this.singupForm.value.passwordConfirm) {
      this.toastService.error('As senhas não coincidem');
      return;
    }
    
    this.registerService.register(
      this.singupForm.value.email, 
      this.singupForm.value.password, 
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
  