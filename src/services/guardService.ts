import { apiClient } from './apiClient';

export interface GuardEntryParams {
  visitorName: string;
  phone: string;
  flat: string;
  category: 'Guest' | 'Delivery' | 'Cab' | 'Service';
  photoBase64?: string;
  vehicleNumber?: string;
  entryGate?: string;
}

export const guardService = {
  // Get Guard Dashboard metrics
  async getGuardDashboardStats() {
    return apiClient.get('/guard/dashboard');
  },

  // Guard registers a new walk-in entry request
  async registerEntry(params: GuardEntryParams) {
    return apiClient.post('/guard/visitors/entry', params);
  },

  // Verify 6-digit entry code or QR code at gate
  async verifyEntryCode(entryCode: string) {
    return apiClient.post('/guard/visitors/verify-code', { entryCode });
  },

  // Record visitor exit from society gate
  async markVisitorExit(logId: string) {
    return apiClient.post(`/guard/visitors/exit/${logId}`);
  },

  // Guard searches resident directory
  async searchResidents(query: string) {
    return apiClient.get(`/guard/residents?q=${encodeURIComponent(query)}`);
  },

  // Toggle Guard Duty Status (ON DUTY / OFF DUTY)
  async toggleGuardDuty(onDuty: boolean) {
    return apiClient.patch('/guard/duty', { onDuty });
  },

  // Get Guard Profile
  async getGuardProfile() {
    return apiClient.get('/guard/profile');
  },
};

