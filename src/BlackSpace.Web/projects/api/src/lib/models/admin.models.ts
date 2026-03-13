export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface UpdateMemberRequest {
  fullName: string;
  email: string;
  roleTitle?: string;
  organization?: string;
  referralSource?: string;
}

export interface MemberListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface NextMeetupDateResponse {
  nextMeetupDate: string;
}

export interface UpdateNextMeetupDateRequest {
  nextMeetupDate: string;
}

export interface ReferralSourcesResponse {
  sources: string[];
}

export interface UpdateReferralSourcesRequest {
  sources: string[];
}
