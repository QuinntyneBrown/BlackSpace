import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api-config';
import { ContentStats } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getStats(): Observable<ContentStats> {
    return this.http.get<ContentStats>(
      `${this.baseUrl}/api/content/stats`,
    );
  }

  getReferralSources(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/api/content/referral-sources`,
    );
  }
}
