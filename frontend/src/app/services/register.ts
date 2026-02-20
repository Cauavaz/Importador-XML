import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {

  apiUrl:string = `${environment.apiUrl}/auth/register`;

  constructor(private httpClient: HttpClient) {}

  register(username: string, password: string, role: string = 'user'): Observable<any> {
    return this.httpClient.post(this.apiUrl, { username, password, role });
  }
}
