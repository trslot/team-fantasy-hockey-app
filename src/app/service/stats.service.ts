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
    return this.http.get(`http://100.92.58.111:5000/stats`).pipe(
      timeout(3000),
      catchError(err => {
        console.warn('Primary Stats API failed. Trying localhost...', err);

        return this.http.get(`http://localhost:5000/stats`).pipe(
          timeout(3000),
          catchError(localErr => {
            console.error('Localhost Stats API also failed:', localErr);
            return of(null);
          })
        );
      })
    );
  }

  getGames() {
    return this.http.get(`http://100.92.58.111:5000/schedule`).pipe(
      timeout(3000),
      catchError(err => {
        console.warn('Games API failed. Trying localhost...', err);

        return this.http.get(`http://localhost:5000/schedule`).pipe(
          timeout(3000),
          catchError(localErr => {
            console.error('Localhost Games API error:', localErr);
            return of(null);
          })
        );
      })
    );
  }

  getPlayerStats(playerId: number) {
    return this.http.get(`http://100.92.58.111:5000/players`, {
      params: { playerId }
    }).pipe(
      timeout(3000),
      catchError(err => {
        console.warn('Player Stats API failed. Trying localhost...', err);

        return this.http.get(`http://localhost:5000/players`, {
          params: { playerId }
        }).pipe(
          timeout(3000),
          catchError(localErr => {
            console.error('Localhost Player Stats API error:', localErr);
            return of(null);
          })
        );
      })
    );
  }

  getRosters(teamId: string) {
    return this.http.get(`http://100.92.58.111:5000/rosters`, {
      params: { teamId }
    }).pipe(
      timeout(3000),
      catchError(err => {
        console.warn('Rosters API failed. Trying localhost...', err);

        return this.http.get(`http://localhost:5000/rosters`, {
          params: { teamId }
        }).pipe(
          timeout(3000),
          catchError(localErr => {
            console.error('Localhost Rosters API error:', localErr);
            return of(null);
          })
        );
      })
    );
  }

  getSeason() {
    return this.http.get(`http://100.92.58.111:5000/seasons`).pipe(
      timeout(3000),
      catchError(err => {
        console.warn('Seasons API failed. Trying localhost...', err);

        return this.http.get(`http://localhost:5000/seasons`).pipe(
          timeout(3000),
          catchError(localErr => {
            console.error('Localhost Seasons API error:', localErr);
            return of(null);
          })
        );
      })
    );
  }

  getStandingSeason() {
    return this.http.get(`http://100.92.58.111:5000/standing-seasons`).pipe(
      timeout(3000),
      catchError(err => {
        console.warn('Standing Seasons API failed. Trying localhost...', err);

        return this.http.get(`http://localhost:5000/standing-seasons`).pipe(
          timeout(3000),
          catchError(localErr => {
            console.error('Localhost Standing Seasons API error:', localErr);
            return of(null);
          })
        );
      })
    );
  }

  getPastStats(date: number) {
    return this.http.get(`http://100.92.58.111:5000/past-stats`, {
      params: { date }
    }).pipe(
      timeout(3000),
      catchError(err => {
        console.warn('Past Stats API failed. Trying localhost...', err);

        return this.http.get(`http://localhost:5000/past-stats`, {
          params: { date }
        }).pipe(
          timeout(3000),
          catchError(localErr => {
            console.error('Localhost Past Stats API error:', localErr);
            return of(null);
          })
        );
      })
    );
  }
}
