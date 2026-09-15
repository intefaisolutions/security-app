import { apiClient, setAuthToken } from './apiClient';

export interface LoginParams {
  identifier: string;
  password?: string;
  role: 'resident' | 'guard';
}

export interface VerifyOtpParams {
  identifier: string;
  otp: string;
  role?: 'resident' | 'guard';
}

export const authService = {
  // Login with Mobile Number
  async login(params: LoginParams) {
    return apiClient.post('/auth/login', params);
  },

  // Verify 4-digit OTP
  async verifyOtp(params: VerifyOtpParams) {
    const response: any = await apiClient.post('/auth/verify-otp', {
      identifier: params.identifier,
      otp: params.otp,
      role: params.role,
    });
    if (response?.data?.token) {
      setAuthToken(response.data.token);
      // Sync FCM push device token
      try {
        await authService.updateDeviceToken('fcm_token_guardconnect_2026');
      } catch (e) {}
    }
    return response;
  },

  // Resend OTP
  async resendOtp(identifier: string) {
    return apiClient.post('/auth/resend-otp', {
      phone: identifier,
      identifier,
    });
  },

  // Logout
  async logout() {
    try {
      const result = await apiClient.post('/auth/logout');
      return result;
    } finally {
      setAuthToken(null);
    }
  },

  // Get Logged-in User Profile
  async getUserProfile() {
    return apiClient.get('/user/profile');
  },

  // Update User Profile
  async updateUserProfile(data: { name?: string; email?: string; emergencyContact?: string }) {
    return apiClient.put('/user/profile', data);
  },

  // Register / Sync Push Device Token
  async updateDeviceToken(deviceToken: string) {
    return apiClient.post('/user/device-token', { deviceToken });
  },
};

