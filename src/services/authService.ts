import { apiClient, setAuthToken } from './apiClient';
import { API_CONFIG } from './apiConfig';

export interface LoginParams {
  identifier: string;
  password?: string;
  role: 'resident' | 'guard';
}

export interface VerifyOtpParams {
  sessionId: string;
  otp: string;
  role: 'resident' | 'guard';
}

export const authService = {
  // Login with Mobile Number / Guard Employee ID
  async login(params: LoginParams) {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return {
        success: true,
        message: 'OTP sent to mobile number',
        data: { sessionId: 'mock_session_123', expiresIn: 30 },
      };
    }
    return apiClient.post('/auth/login', params);
  },

  // Verify 6-digit OTP
  async verifyOtp(params: VerifyOtpParams) {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      const mockToken = 'mock_jwt_token_guardconnect_2026';
      setAuthToken(mockToken);
      return {
        success: true,
        message: 'Login successful',
        data: {
          token: mockToken,
          user: {
            id: 'usr_101',
            name: params.role === 'guard' ? 'Ramesh Kumar (Guard)' : 'Arjun Mehta',
            role: params.role,
            flat: params.role === 'resident' ? 'A-1203' : undefined,
            tower: params.role === 'resident' ? 'Tower A' : undefined,
          },
        },
      };
    }

    const response: any = await apiClient.post('/auth/verify-otp', params);
    if (response?.data?.token) {
      setAuthToken(response.data.token);
    }
    return response;
  },

  // Resend OTP
  async resendOtp(sessionId: string) {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return { success: true, message: 'OTP resent successfully' };
    }
    return apiClient.post('/auth/resend-otp', { sessionId });
  },

  // Logout
  async logout() {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      setAuthToken(null);
      return { success: true, message: 'Logged out successfully' };
    }
    const result = await apiClient.post('/auth/logout');
    setAuthToken(null);
    return result;
  },
};
