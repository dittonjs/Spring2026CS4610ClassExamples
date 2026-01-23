// Mock Next.js server modules before importing
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: jest.fn().mockResolvedValue(data),
      status: init?.status || 200,
    })),
  },
}));

import { POST, GET } from '@/app/api/embed/route';

// Mock the iframeHeight utility
jest.mock('@/app/_utils/iframeHeight', () => ({
  calculateIframeHeight: jest.fn((code: string) => {
    const lines = code.split('\n').filter((line, index, array) => {
      if (index === array.length - 1 && line.trim() === '') {
        return false;
      }
      return true;
    });
    return Math.max(200, 60 + 20 + (lines.length * 22));
  }),
}));

describe('API /api/embed', () => {
  const createMockRequest = (method: string, body?: any, searchParams?: Record<string, string>) => {
    const url = new URL('http://localhost:3000/api/embed');
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const headers = new Map();
    headers.set('origin', 'http://localhost:3000');

    return {
      json: jest.fn().mockResolvedValue(body || {}),
      headers: {
        get: (name: string) => headers.get(name),
      },
      nextUrl: {
        origin: 'http://localhost:3000',
        searchParams: url.searchParams,
      },
    };
  };

  describe('POST', () => {
    it('should generate embed code with required code parameter', async () => {
      const request = createMockRequest('POST', {
        code: 'console.log("Hello");',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.embedCode).toContain('<iframe');
      expect(data.embedCode).toContain('embed=true');
      expect(data.url).toContain('/s/javascript/');
      expect(data.height).toBeDefined();
      expect(data.language).toBe('javascript');
      expect(data.theme).toBe('light');
    });

    it('should use provided language', async () => {
      const request = createMockRequest('POST', {
        code: 'print("Hello")',
        language: 'python',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.language).toBe('python');
      expect(data.url).toContain('/s/python/');
    });

    it('should use provided theme', async () => {
      const request = createMockRequest('POST', {
        code: 'const x = 1;',
        theme: 'dark',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.theme).toBe('dark');
      expect(data.url).toContain('theme=dark');
    });

    it('should use provided width and height', async () => {
      const request = createMockRequest('POST', {
        code: 'const x = 1;',
        width: '800px',
        height: '600px',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.width).toBe('800px');
      expect(data.height).toBe('600px');
      expect(data.embedCode).toContain('width="800px"');
      expect(data.embedCode).toContain('height="600px"');
    });

    it('should calculate height if not provided', async () => {
      const code = 'line1\nline2\nline3\nline4\nline5';
      const request = createMockRequest('POST', {
        code,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.height).toBeDefined();
      expect(typeof data.height).toBe('string');
      expect(data.height).toContain('px');
    });

    it('should return error if code is missing', async () => {
      const request = createMockRequest('POST', {});

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Code is required');
    });

    it('should return error if code is not a string', async () => {
      const request = createMockRequest('POST', {
        code: 123,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Code is required');
    });

    it('should return error if theme is invalid', async () => {
      const request = createMockRequest('POST', {
        code: 'const x = 1;',
        theme: 'invalid',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Theme must be');
    });

    it('should handle baseUrl parameter', async () => {
      const request = createMockRequest('POST', {
        code: 'const x = 1;',
        baseUrl: 'https://example.com',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.url).toContain('https://example.com');
    });
  });

  describe('GET', () => {
    it('should generate embed code from query parameters', async () => {
      const request = createMockRequest('GET', undefined, {
        code: 'console.log("Hello");',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.embedCode).toContain('<iframe');
      expect(data.url).toContain('/s/javascript/');
    });

    it('should use query parameters for language and theme', async () => {
      const request = createMockRequest('GET', undefined, {
        code: 'print("Hello")',
        language: 'python',
        theme: 'dark',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(data.language).toBe('python');
      expect(data.theme).toBe('dark');
      expect(data.url).toContain('/s/python/');
      expect(data.url).toContain('theme=dark');
    });

    it('should return error if code parameter is missing', async () => {
      const request = createMockRequest('GET', undefined, {});

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Code parameter is required');
    });
  });
});
