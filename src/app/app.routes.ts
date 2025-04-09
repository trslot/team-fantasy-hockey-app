import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
      path: 'home',
      loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
      canActivate: [AuthGuard]
    },
  {
    path: '**',
    redirectTo: ''
  }
];
