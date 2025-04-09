import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  today: string = new Date().toLocaleDateString('en-CA');

  constructor(private http: HttpClient,) { }

  getStats() {
    return this.http.get(`http://localhost:5000/stats`).pipe(
      timeout(10000),
      catchError(err => {
        console.error('Stats API error:', err);
        return of(null);
      })
    );
  }

  getGames() {
    return this.http.get(`http://localhost:5000/schedule`).pipe(
      timeout(10000),
      catchError(err => {
        console.error('Games API error:', err);
        return of(null);
      })
    );
  }

  getPlayerStats(playerID: number) {
    return this.http.get(`http://localhost:5000/players`, { params: { playerID } }).pipe(
      timeout(10000),
      catchError(err => {
        console.error('Player Stats API error:', err);
        return of(null);
      })
    );
  }

  getRosters(teamID: string) {
    return this.http.get(`http://localhost:5000/rosters`, { params: { teamID }}).pipe(
      timeout(10000),
      catchError(err => {
        console.error('Rosters API error:', err);
        return of(null);
      })
    );
  }
}
