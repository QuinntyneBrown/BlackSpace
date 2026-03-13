import { InjectionToken, Provider } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:5000',
});

export function provideApi(baseUrl?: string): Provider[] {
  const providers: Provider[] = [];
  if (baseUrl) {
    providers.push({ provide: API_BASE_URL, useValue: baseUrl });
  }
  return providers;
}
