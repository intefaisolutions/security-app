import { API_CONFIG } from './apiConfig';

declare const __DEV__: boolean;

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
}

// Keys whose values will be masked in console logs for security
const SENSITIVE_KEYS = new Set([
  'password',
  'otp',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'token',
  'secret',
  'jwt',
]);

// Utility to safely clone and mask sensitive/large data before printing to console
function maskSensitiveData(data: any): any {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') {
    if (data.length > 300 || data.startsWith('data:image')) {
      return '[Binary/Base64 Data Truncated]';
    }
    return data;
  }
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(maskSensitiveData);
  }

  const maskedObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      maskedObj[key] = '***MASKED***';
    } else {
      maskedObj[key] = maskSensitiveData(value);
    }
  }
  return maskedObj;
}

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

function logApiRequest(method: string, url: string, headers: Record<string, string>, payload?: any) {
  if (!isDev) return;
  const maskedHeaders = maskSensitiveData(headers);
  const maskedPayload = payload ? maskSensitiveData(payload) : undefined;

  console.log(`\n========== API REQUEST ==========`);
  console.log(`METHOD: ${method}`);
  console.log(`URL: ${url}`);
  console.log(`HEADERS:`, JSON.stringify(maskedHeaders, null, 2));
  if (maskedPayload !== undefined) {
    console.log(`PAYLOAD:`, JSON.stringify(maskedPayload, null, 2));
  }
  console.log(`=================================\n`);
}

function logApiResponse(status: number, url: string, durationMs: number, data: any) {
  if (!isDev) return;
  const maskedData = maskSensitiveData(data);

  console.log(`\n========== API RESPONSE ==========`);
  console.log(`STATUS: ${status}`);
  console.log(`URL: ${url}`);
  console.log(`RESPONSE TIME: ${durationMs}ms`);
  console.log(`DATA:`, JSON.stringify(maskedData, null, 2));
  console.log(`=================================\n`);
}

function logApiError(status: number | string, url: string, payload: any, errorData: any, message: string) {
  if (!isDev) return;
  const maskedPayload = payload ? maskSensitiveData(payload) : undefined;
  const maskedErrorData = errorData ? maskSensitiveData(errorData) : undefined;

  console.log(`\n========== API ERROR ==========`);
  console.log(`STATUS: ${status}`);
  console.log(`URL: ${url}`);
  if (maskedPayload !== undefined) {
    console.log(`PAYLOAD:`, JSON.stringify(maskedPayload, null, 2));
  }
  if (maskedErrorData !== undefined) {
    console.log(`ERROR DATA:`, JSON.stringify(maskedErrorData, null, 2));
  }
  console.log(`MESSAGE: ${message}`);
  console.log(`=================================\n`);
}

export const apiClient = {
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  async post<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  },

  async put<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  async patch<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  },

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  async request<T>(endpoint: string, options: RequestOptions & { method: string }): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    logApiRequest(options.method, url, headers, options.body);

    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        method: options.method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const durationMs = Date.now() - startTime;

      let data: any = {};
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = responseText;
        }
      }

      if (!response.ok) {
        logApiError(response.status, url, options.body, data, data?.message || `HTTP Error ${response.status}`);
        throw new Error(data?.message || `HTTP Error ${response.status}`);
      }

      logApiResponse(response.status, url, durationMs, data);
      return data as T;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        logApiError('TIMEOUT', url, options.body, null, 'Request timed out');
      } else if (!error.message?.startsWith('HTTP Error')) {
        logApiError('NETWORK_ERROR', url, options.body, null, error.message || 'Network request failed');
      }
      throw error;
    }
  },
};
