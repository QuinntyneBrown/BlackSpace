import { TestBed } from '@angular/core/testing';
import { API_BASE_URL, provideApi } from './api-config';

describe('API Configuration', () => {
  describe('API_BASE_URL', () => {
    it('should provide default base URL when no override is configured', () => {
      TestBed.configureTestingModule({});
      const baseUrl = TestBed.inject(API_BASE_URL);
      expect(baseUrl).toBe('http://localhost:5000');
    });

    it('should use custom base URL when overridden', () => {
      TestBed.configureTestingModule({
        providers: [{ provide: API_BASE_URL, useValue: 'https://api.example.com' }],
      });
      const baseUrl = TestBed.inject(API_BASE_URL);
      expect(baseUrl).toBe('https://api.example.com');
    });
  });

  describe('provideApi', () => {
    it('should return empty array when no baseUrl is provided', () => {
      const providers = provideApi();
      expect(providers).toEqual([]);
    });

    it('should return empty array when baseUrl is empty string', () => {
      const providers = provideApi('');
      expect(providers).toEqual([]);
    });

    it('should return provider with custom base URL when baseUrl is provided', () => {
      const providers = provideApi('https://custom-api.example.com');
      expect(providers).toHaveLength(1);

      TestBed.configureTestingModule({ providers });
      const baseUrl = TestBed.inject(API_BASE_URL);
      expect(baseUrl).toBe('https://custom-api.example.com');
    });
  });
});
