import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from '../Jwt/jwt.service';
import { Observable } from 'rxjs';
import { Date } from './dates.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatesService {

  private apiUrl = 'http://localhost:8000/api/admin/dates';

  constructor(private http: HttpClient, private jwtService: JwtService) { 
    this.initialize();
  }

  private initialize(): void {
    this.jwtService.loginUser('Henk', 'henk');
  }

  getDates() : Observable<Date[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.jwtService.getToken(),
      'Content-Type': 'application/json'
    });
    
    return this.http.get<{ [key: string]: number }>(this.apiUrl, { headers: headers }).pipe(
      map(data => {
        // Convert the data into an array of Date objects
        const datesArray: Date[] = Object.entries(data).map(([date, value]) => ({ date, value }));
        return datesArray;
      })
    );
  }
}
