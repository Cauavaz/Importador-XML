import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NfeService {
  private apiUrl = 'http://localhost:3000/nfe';

  constructor(private http: HttpClient) {}

  uploadXml(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/upload`, formData, { headers });
  }

  listNfes(page: number = 1, limit: number = 50): Observable<any> {
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers });
  }

  getNfeDetails(nfeId: number): Observable<any> {
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/${nfeId}`, { headers });
  }

  deleteNfe(nfeId: number): Observable<any> {
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${nfeId}`, { headers });
  }
}
