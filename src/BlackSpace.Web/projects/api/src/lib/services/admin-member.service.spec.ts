import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { AdminMemberService } from './admin-member.service';
import { API_BASE_URL } from '../api-config';
import { MemberResponse } from '../models/member.models';
import { MemberListParams, PagedResponse, UpdateMemberRequest } from '../models/admin.models';

describe('AdminMemberService', () => {
  let service: AdminMemberService;
  let httpTesting: HttpTestingController;

  const defaultBaseUrl = 'http://localhost:5000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AdminMemberService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('listMembers', () => {
    const mockMember: MemberResponse = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      roleTitle: 'Engineer',
      organization: 'Acme Corp',
      createdAtUtc: '2026-01-15T10:30:00Z',
    };

    const mockPagedResponse: PagedResponse<MemberResponse> = {
      items: [mockMember],
      totalCount: 1,
      page: 1,
      pageSize: 10,
    };

    it('should send GET request to /api/admin/members', () => {
      service.listMembers({}).subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/members`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPagedResponse);
    });

    it('should return paged response on success', () => {
      let result: PagedResponse<MemberResponse> | undefined;
      service.listMembers({}).subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/members`);
      req.flush(mockPagedResponse);

      expect(result).toEqual(mockPagedResponse);
      expect(result!.items).toHaveLength(1);
      expect(result!.totalCount).toBe(1);
    });

    it('should send page and pageSize query params', () => {
      const params: MemberListParams = { page: 2, pageSize: 25 };
      service.listMembers(params).subscribe();

      const req = httpTesting.expectOne(
        (r) => r.url === `${defaultBaseUrl}/api/admin/members`,
      );
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('pageSize')).toBe('25');
      req.flush(mockPagedResponse);
    });

    it('should send search query param', () => {
      const params: MemberListParams = { search: 'jane' };
      service.listMembers(params).subscribe();

      const req = httpTesting.expectOne(
        (r) => r.url === `${defaultBaseUrl}/api/admin/members`,
      );
      expect(req.request.params.get('search')).toBe('jane');
      req.flush(mockPagedResponse);
    });

    it('should send sortBy and sortDirection query params', () => {
      const params: MemberListParams = { sortBy: 'fullName', sortDirection: 'desc' };
      service.listMembers(params).subscribe();

      const req = httpTesting.expectOne(
        (r) => r.url === `${defaultBaseUrl}/api/admin/members`,
      );
      expect(req.request.params.get('sortBy')).toBe('fullName');
      expect(req.request.params.get('sortDirection')).toBe('desc');
      req.flush(mockPagedResponse);
    });

    it('should send all query params together', () => {
      const params: MemberListParams = {
        page: 1,
        pageSize: 10,
        search: 'test',
        sortBy: 'email',
        sortDirection: 'asc',
      };
      service.listMembers(params).subscribe();

      const req = httpTesting.expectOne(
        (r) => r.url === `${defaultBaseUrl}/api/admin/members`,
      );
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('pageSize')).toBe('10');
      expect(req.request.params.get('search')).toBe('test');
      expect(req.request.params.get('sortBy')).toBe('email');
      expect(req.request.params.get('sortDirection')).toBe('asc');
      req.flush(mockPagedResponse);
    });

    it('should not send undefined params', () => {
      const params: MemberListParams = { page: 1 };
      service.listMembers(params).subscribe();

      const req = httpTesting.expectOne(
        (r) => r.url === `${defaultBaseUrl}/api/admin/members`,
      );
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.has('pageSize')).toBe(false);
      expect(req.request.params.has('search')).toBe(false);
      expect(req.request.params.has('sortBy')).toBe(false);
      expect(req.request.params.has('sortDirection')).toBe(false);
      req.flush(mockPagedResponse);
    });

    it('should propagate server errors', () => {
      let error: HttpErrorResponse | undefined;
      service.listMembers({}).subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/members`);
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });

      expect(error).toBeDefined();
      expect(error!.status).toBe(500);
    });
  });

  describe('getMember', () => {
    const memberId = '123e4567-e89b-12d3-a456-426614174000';

    const mockResponse: MemberResponse = {
      id: memberId,
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      roleTitle: 'Engineer',
      organization: 'Acme Corp',
      createdAtUtc: '2026-01-15T10:30:00Z',
    };

    it('should send GET request to /api/members/{id}', () => {
      service.getMember(memberId).subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/members/${memberId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return the member response on success', () => {
      let result: MemberResponse | undefined;
      service.getMember(memberId).subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/members/${memberId}`);
      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it('should propagate 404 not found error', () => {
      let error: HttpErrorResponse | undefined;
      service.getMember('nonexistent-id').subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/members/nonexistent-id`);
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(error).toBeDefined();
      expect(error!.status).toBe(404);
    });
  });

  describe('updateMember', () => {
    const memberId = '123e4567-e89b-12d3-a456-426614174000';

    const mockRequest: UpdateMemberRequest = {
      fullName: 'Jane Updated',
      email: 'jane.updated@example.com',
      roleTitle: 'Senior Engineer',
      organization: 'New Corp',
      referralSource: 'LinkedIn',
    };

    const mockResponse: MemberResponse = {
      id: memberId,
      fullName: 'Jane Updated',
      email: 'jane.updated@example.com',
      roleTitle: 'Senior Engineer',
      organization: 'New Corp',
      createdAtUtc: '2026-01-15T10:30:00Z',
    };

    it('should send PUT request to /api/admin/members/{id}', () => {
      service.updateMember(memberId, mockRequest).subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/members/${memberId}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });

    it('should send the request body correctly', () => {
      service.updateMember(memberId, mockRequest).subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/members/${memberId}`);
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });

    it('should return the updated member response on success', () => {
      let result: MemberResponse | undefined;
      service.updateMember(memberId, mockRequest).subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/members/${memberId}`);
      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it('should send request with only required fields', () => {
      const minimalRequest: UpdateMemberRequest = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
      };

      service.updateMember(memberId, minimalRequest).subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/members/${memberId}`);
      expect(req.request.body).toEqual(minimalRequest);
      expect(req.request.body.roleTitle).toBeUndefined();
      expect(req.request.body.organization).toBeUndefined();
      expect(req.request.body.referralSource).toBeUndefined();
      req.flush(mockResponse);
    });

    it('should propagate 404 not found error', () => {
      let error: HttpErrorResponse | undefined;
      service.updateMember('nonexistent-id', mockRequest).subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/members/nonexistent-id`);
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(error).toBeDefined();
      expect(error!.status).toBe(404);
    });

    it('should propagate 409 conflict error', () => {
      let error: HttpErrorResponse | undefined;
      service.updateMember(memberId, mockRequest).subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/members/${memberId}`);
      req.flush(
        { error: 'already_registered', message: 'This email is already part of the community.' },
        { status: 409, statusText: 'Conflict' },
      );

      expect(error).toBeDefined();
      expect(error!.status).toBe(409);
      expect(error!.error.error).toBe('already_registered');
    });

    it('should propagate 422 validation error', () => {
      let error: HttpErrorResponse | undefined;
      service.updateMember(memberId, mockRequest).subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/members/${memberId}`);
      req.flush(
        {
          error: 'validation_failed',
          message: 'Please fix the errors below.',
          errors: { email: ['Invalid email format'] },
        },
        { status: 422, statusText: 'Unprocessable Entity' },
      );

      expect(error).toBeDefined();
      expect(error!.status).toBe(422);
      expect(error!.error.error).toBe('validation_failed');
      expect(error!.error.errors.email).toEqual(['Invalid email format']);
    });
  });

  describe('deleteMember', () => {
    const memberId = '123e4567-e89b-12d3-a456-426614174000';

    it('should send DELETE request to /api/admin/members/{id}', () => {
      service.deleteMember(memberId).subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/members/${memberId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should complete successfully on 200', () => {
      let completed = false;
      service.deleteMember(memberId).subscribe({
        complete: () => (completed = true),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/members/${memberId}`);
      req.flush(null);

      expect(completed).toBe(true);
    });

    it('should propagate 404 not found error', () => {
      let error: HttpErrorResponse | undefined;
      service.deleteMember('nonexistent-id').subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/admin/members/nonexistent-id`);
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(error).toBeDefined();
      expect(error!.status).toBe(404);
    });
  });

  describe('with custom base URL', () => {
    const customBaseUrl = 'https://api.production.com';

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: API_BASE_URL, useValue: customBaseUrl },
        ],
      });
      service = TestBed.inject(AdminMemberService);
      httpTesting = TestBed.inject(HttpTestingController);
    });

    it('should use custom base URL for listMembers', () => {
      service.listMembers({}).subscribe();

      const req = httpTesting.expectOne(`${customBaseUrl}/api/admin/members`);
      expect(req.request.url).toBe(`${customBaseUrl}/api/admin/members`);
      req.flush({ items: [], totalCount: 0, page: 1, pageSize: 10 });
    });

    it('should use custom base URL for getMember', () => {
      service.getMember('some-id').subscribe();

      const req = httpTesting.expectOne(`${customBaseUrl}/api/members/some-id`);
      expect(req.request.url).toBe(`${customBaseUrl}/api/members/some-id`);
      req.flush({});
    });

    it('should use custom base URL for updateMember', () => {
      const request: UpdateMemberRequest = { fullName: 'Test', email: 'test@example.com' };
      service.updateMember('some-id', request).subscribe();

      const req = httpTesting.expectOne(`${customBaseUrl}/api/admin/members/some-id`);
      expect(req.request.url).toBe(`${customBaseUrl}/api/admin/members/some-id`);
      req.flush({});
    });

    it('should use custom base URL for deleteMember', () => {
      service.deleteMember('some-id').subscribe();

      const req = httpTesting.expectOne(`${customBaseUrl}/api/admin/members/some-id`);
      expect(req.request.url).toBe(`${customBaseUrl}/api/admin/members/some-id`);
      req.flush(null);
    });
  });
});
