import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';


bootstrapApplication(App, appConfig).then(() => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.body.classList.add('is-loaded');
  }
});

