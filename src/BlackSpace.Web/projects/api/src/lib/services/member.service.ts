import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api-config';
import { CreateMemberRequest, MemberResponse } from '../models/member.models';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  createMember(request: CreateMemberRequest): Observable<MemberResponse> {
    return this.http.post<MemberResponse>(
      `${this.baseUrl}/api/members`,
      request,
    );
  }

  getMember(id: string): Observable<MemberResponse> {
    return this.http.get<MemberResponse>(
      `${this.baseUrl}/api/members/${id}`,
    );
  }
}
