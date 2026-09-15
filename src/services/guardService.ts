import { apiClient } from './apiClient';
import { API_CONFIG } from './apiConfig';

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
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return {
        success: true,
        data: {
          inSocietyCount: 18,
          pendingCount: 3,
          totalEntriesToday: 45,
          totalExitsToday: 27,
        },
      };
    }
    return apiClient.get('/guard/dashboard');
  },

  // Guard registers a new walk-in entry request
  async registerEntry(params: GuardEntryParams) {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return {
        success: true,
        message: 'Approval request sent to resident',
        data: { requestId: `req_${Date.now()}`, status: 'PENDING' },
      };
    }
    return apiClient.post('/guard/visitors/entry', params);
  },

  // Verify 6-digit entry code or QR code at gate
  async verifyEntryCode(entryCode: string) {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return {
        success: true,
        message: 'Code verified successfully',
        data: {
          passId: 'pass_101',
          visitorName: 'Rohan Sharma',
          residentName: 'Arjun Mehta',
          flat: 'A-1203',
          status: 'VERIFIED',
        },
      };
    }
    return apiClient.post('/guard/visitors/verify-code', { entryCode });
  },

  // Record visitor exit from society gate
  async markVisitorExit(logId: string) {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return { success: true, message: 'Visitor exit logged' };
    }
    return apiClient.post(`/guard/visitors/exit/${logId}`);
  },

  // Guard searches resident directory
  async searchResidents(query: string) {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return {
        success: true,
        data: [
          { id: '1', name: 'Arjun Mehta', flat: 'A-1203 • Tower A', phone: '+919876543210' },
          { id: '2', name: 'Sneha Kapoor', flat: 'B-0505 • Tower B', phone: '+919876543211' },
          { id: '3', name: 'Vikram Reddy', flat: 'C-0802 • Tower C', phone: '+919876543212' },
        ],
      };
    }
    return apiClient.get(`/guard/residents?search=${encodeURIComponent(query)}`);
  },
};
