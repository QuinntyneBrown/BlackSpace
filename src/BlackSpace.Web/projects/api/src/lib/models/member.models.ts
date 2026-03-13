export interface CreateMemberRequest {
  fullName: string;
  email: string;
  roleTitle?: string;
  organization?: string;
  referralSource?: string;
}

export interface MemberResponse {
  id: string;
  fullName: string;
  email: string;
  roleTitle?: string;
  organization?: string;
  createdAtUtc: string;
}
