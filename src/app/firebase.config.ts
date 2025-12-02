// src/app/firebase.config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { environment } from '../environment/environment';

// Initialize Firebase once globally
export const firebaseApp = !getApps().length
  ? initializeApp(environment.firebase)
  : getApp();
