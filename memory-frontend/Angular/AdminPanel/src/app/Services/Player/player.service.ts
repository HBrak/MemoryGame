import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from './player.model';
import { JwtService } from '../Jwt/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private apiUrl = 'http://localhost:8000/api/admin/players';

  constructor(private http: HttpClient, private jwtService: JwtService) { 
    this.initialize();
  }

  private initialize(): void {
    this.jwtService.loginUser('Henk', 'henk');
  }

  getPlayers(): Observable<Player[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.jwtService.getToken(),
      'Content-Type': 'application/json'
    });
    return this.http.get<Player[]>(this.apiUrl, { headers: headers })
  }
}
