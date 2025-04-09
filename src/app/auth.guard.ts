import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Promise<boolean | import('@angular/router').UrlTree> {
    const auth = getAuth();
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        if (user) {
          resolve(true);
        } else {
          resolve(this.router.createUrlTree(['']));
        }
      });
    });
  }
}