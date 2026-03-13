import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { MemberService } from './member.service';
import { API_BASE_URL } from '../api-config';
import { CreateMemberRequest, MemberResponse } from '../models/member.models';

describe('MemberService', () => {
  let service: MemberService;
  let httpTesting: HttpTestingController;

  const defaultBaseUrl = 'http://localhost:5000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MemberService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('createMember', () => {
    const mockRequest: CreateMemberRequest = {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      roleTitle: 'Engineer',
      organization: 'Acme Corp',
      referralSource: 'LinkedIn',
    };

    const mockResponse: MemberResponse = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      roleTitle: 'Engineer',
      organization: 'Acme Corp',
      createdAtUtc: '2026-01-15T10:30:00Z',
    };

    it('should send POST request to /api/members', () => {
      service.createMember(mockRequest).subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/members`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should send the request body correctly', () => {
      service.createMember(mockRequest).subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/members`);
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });

    it('should return the member response on success', () => {
      let result: MemberResponse | undefined;
      service.createMember(mockRequest).subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/members`);
      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it('should send request with only required fields', () => {
      const minimalRequest: CreateMemberRequest = {
        fullName: 'John Smith',
        email: 'john@example.com',
      };

      service.createMember(minimalRequest).subscribe();

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/members`);
      expect(req.request.body).toEqual(minimalRequest);
      expect(req.request.body.roleTitle).toBeUndefined();
      expect(req.request.body.organization).toBeUndefined();
      expect(req.request.body.referralSource).toBeUndefined();
      req.flush(mockResponse);
    });

    it('should propagate 409 conflict error', () => {
      let error: HttpErrorResponse | undefined;
      service.createMember(mockRequest).subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/members`);
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
      service.createMember(mockRequest).subscribe({
        error: (err) => (error = err),
      });

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/members`);
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

    it('should handle member with optional fields as null', () => {
      const responseWithNulls: MemberResponse = {
        id: memberId,
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        createdAtUtc: '2026-01-15T10:30:00Z',
      };

      let result: MemberResponse | undefined;
      service.getMember(memberId).subscribe((res) => (result = res));

      const req = httpTesting.expectOne(`${defaultBaseUrl}/api/members/${memberId}`);
      req.flush(responseWithNulls);

      expect(result).toEqual(responseWithNulls);
      expect(result!.roleTitle).toBeUndefined();
      expect(result!.organization).toBeUndefined();
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
      service = TestBed.inject(MemberService);
      httpTesting = TestBed.inject(HttpTestingController);
    });

    it('should use custom base URL for createMember', () => {
      const request: CreateMemberRequest = {
        fullName: 'Test User',
        email: 'test@example.com',
      };

      service.createMember(request).subscribe();

      const req = httpTesting.expectOne(`${customBaseUrl}/api/members`);
      expect(req.request.url).toBe(`${customBaseUrl}/api/members`);
      req.flush({});
    });

    it('should use custom base URL for getMember', () => {
      service.getMember('some-id').subscribe();

      const req = httpTesting.expectOne(`${customBaseUrl}/api/members/some-id`);
      expect(req.request.url).toBe(`${customBaseUrl}/api/members/some-id`);
      req.flush({});
    });
  });
});
