// src/app/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from './firebase.config'; // 👈 import ensures app is ready

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Promise<boolean | import('@angular/router').UrlTree> {
    const auth = getAuth(firebaseApp); // 👈 explicitly reference initialized app
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user ? true : this.router.createUrlTree(['']));
      });
    });
  }
}
