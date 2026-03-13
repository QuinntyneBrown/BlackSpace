/*
 * Public API Surface of api
 */

// Models
export type { CreateMemberRequest, MemberResponse } from './lib/models/member.models';
export type { ContentStats } from './lib/models/content.models';
export type { ValidationErrorResponse, ConflictErrorResponse } from './lib/models/error.models';
export type { HealthResponse } from './lib/models/health.models';
export type {
  PagedResponse,
  UpdateMemberRequest,
  MemberListParams,
  NextMeetupDateResponse,
  UpdateNextMeetupDateRequest,
  ReferralSourcesResponse,
  UpdateReferralSourcesRequest,
} from './lib/models/admin.models';

// Configuration
export { API_BASE_URL, provideApi } from './lib/api-config';

// Services
export { MemberService } from './lib/services/member.service';
export { ContentService } from './lib/services/content.service';
export { HealthService } from './lib/services/health.service';
export { AdminMemberService } from './lib/services/admin-member.service';
export { AdminContentService } from './lib/services/admin-content.service';
