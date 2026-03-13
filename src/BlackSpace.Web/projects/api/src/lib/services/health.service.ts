import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api-config';
import { HealthResponse } from '../models/health.models';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  checkHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(
      `${this.baseUrl}/api/health`,
    );
  }
}
