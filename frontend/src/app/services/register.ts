import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {

  apiUrl:string = 'http://localhost:3000/auth/register';

  constructor(private httpClient: HttpClient) {}

  register(username: string, password: string, role: string = 'user'): Observable<any> {
    return this.httpClient.post(this.apiUrl, { username, password, role });
  }
}
