import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api-config';
import {
  NextMeetupDateResponse,
  UpdateNextMeetupDateRequest,
  ReferralSourcesResponse,
  UpdateReferralSourcesRequest,
} from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminContentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getNextMeetupDate(): Observable<NextMeetupDateResponse> {
    return this.http.get<NextMeetupDateResponse>(
      `${this.baseUrl}/api/admin/content/next-meetup`,
    );
  }

  updateNextMeetupDate(request: UpdateNextMeetupDateRequest): Observable<NextMeetupDateResponse> {
    return this.http.put<NextMeetupDateResponse>(
      `${this.baseUrl}/api/admin/content/next-meetup`,
      request,
    );
  }

  getReferralSources(): Observable<ReferralSourcesResponse> {
    return this.http.get<ReferralSourcesResponse>(
      `${this.baseUrl}/api/admin/content/referral-sources`,
    );
  }

  updateReferralSources(request: UpdateReferralSourcesRequest): Observable<ReferralSourcesResponse> {
    return this.http.put<ReferralSourcesResponse>(
      `${this.baseUrl}/api/admin/content/referral-sources`,
      request,
    );
  }
}
