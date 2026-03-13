import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api-config';
import { MemberResponse } from '../models/member.models';
import { MemberListParams, PagedResponse, UpdateMemberRequest } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminMemberService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  listMembers(params: MemberListParams): Observable<PagedResponse<MemberResponse>> {
    let httpParams = new HttpParams();
    if (params.page != null) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.pageSize != null) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }
    if (params.search != null) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.sortBy != null) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params.sortDirection != null) {
      httpParams = httpParams.set('sortDirection', params.sortDirection);
    }
    return this.http.get<PagedResponse<MemberResponse>>(
      `${this.baseUrl}/api/admin/members`,
      { params: httpParams },
    );
  }

  getMember(id: string): Observable<MemberResponse> {
    return this.http.get<MemberResponse>(
      `${this.baseUrl}/api/members/${id}`,
    );
  }

  updateMember(id: string, request: UpdateMemberRequest): Observable<MemberResponse> {
    return this.http.put<MemberResponse>(
      `${this.baseUrl}/api/admin/members/${id}`,
      request,
    );
  }

  deleteMember(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/admin/members/${id}`,
    );
  }
}
