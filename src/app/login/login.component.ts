import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  login() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {
        this.errorMessage = '';
        this.router.navigate(['/home']);
      })
      .catch(error => {
        this.errorMessage = error.message;
      });
  }

  loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        this.errorMessage = '';
        this.router.navigate(['/home']);
      })
      .catch(error => {
        this.errorMessage = error.message;
      });
  }
}