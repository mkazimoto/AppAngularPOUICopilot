import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

// Suprime avisos de deprecação do THREE.Clock vindos de @thatopen/components (lib ainda não migrou para THREE.Timer)
const _warn = console.warn.bind(console);
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
  _warn(...args);
};

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

