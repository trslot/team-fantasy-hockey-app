import { bootstrapApplication } from '@angular/platform-browser';
import { initializeApp } from 'firebase/app';
import { environment } from './environment/environment';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
initializeApp(environment.firebase);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
