import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor(private http: HttpClient) { }

  loginUser(username: string, password: string): void {
    const url = 'http://localhost:8000/api/login_check';
    const data = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('logging in as: ', username, password);
    this.http.post<any>(url, JSON.stringify(data), { headers })
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return error;
        }),
        tap(response => {
          if (response && response.token) {
            this.saveToken(response.token);
          }
        })
      )
      .subscribe();
  }

  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }
}
