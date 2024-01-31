import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from '../Jwt/jwt.service';
import { Observable } from 'rxjs';
import { AggregatedData } from './aggregate.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AggregateService {

  private apiUrl = 'http://localhost:8000/api/admin/aggregate';

  constructor(private http: HttpClient, private jwtService: JwtService) { 
    this.initialize();
  }

  private initialize(): void {
    //this.jwtService.loginUser('Henk', 'henk');
  }

  getData() : Observable<AggregatedData> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.jwtService.getToken(),
      'Content-Type': 'application/json'
    });



    return this.http.get<AggregatedData>(this.apiUrl, { headers: headers })
    .pipe(
      map((response: any) => {
        return this.transformData(response);
      })
    )
  }

  private transformData(data: any): AggregatedData {
    return {
      aantal_spellen: data[0]?.aantal_spellen || 0,
      aantal_spelers: data[1]?.aantal_spelers || 0,
      api: data[2]?.map((item: any) => ({
        api: item.api,
        aantal: item.aantal
      })) || []
    };
  }
}
