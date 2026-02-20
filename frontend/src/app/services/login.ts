import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../types/login-response.type';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Login {

  apiUrl:string = `${environment.apiUrl}/auth/login`;

  constructor(private httpClient: HttpClient) {}

  login(email: string, password: string) {
    return this.httpClient.post<LoginResponse>(this.apiUrl, { username: email, password }).pipe(
      tap((value) => {
        sessionStorage.setItem('auth-token', value.token);
        sessionStorage.setItem('username', value.name);

      })
    );
  } 
}

