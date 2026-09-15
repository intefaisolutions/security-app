import { apiClient } from './apiClient';
import { API_CONFIG } from './apiConfig';

export interface PreApprovePassParams {
  visitorName: string;
  visitorPhone?: string;
  category: 'Guest' | 'Delivery' | 'Cab' | 'Service';
  validDate: string;
  validTimeSlot?: string;
  vehicleNumber?: string;
  notes?: string;
}

export const visitorService = {
  // Resident pre-approves visitor (Creates invite pass)
  async createPreApprovedPass(params: PreApprovePassParams) {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      return {
        success: true,
        message: 'Visitor pass created',
        data: {
          passId: `pass_${Date.now()}`,
          entryCode: mockCode,
          shareableText: `Hey ${params.visitorName}, use entry code ${mockCode} at Green Valley main gate on ${params.validDate}.`,
        },
      };
    }
    return apiClient.post('/visitors/pre-approve', params);
  },

  // Get active visitor passes for resident
  async getActivePasses() {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return {
        success: true,
        data: [
          {
            passId: 'pass_1',
            visitorName: 'Rohan Sharma',
            category: 'Guest',
            entryCode: '482910',
            validDate: '2026-09-15',
            status: 'ACTIVE',
          },
        ],
      };
    }
    return apiClient.get('/visitors/passes');
  },

  // Cancel / Revoke a visitor pass
  async revokePass(passId: string) {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return { success: true, message: 'Pass revoked' };
    }
    return apiClient.delete(`/visitors/passes/${passId}`);
  },

  // Fetch pending approval requests for resident
  async getPendingRequests() {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return {
        success: true,
        data: [
          {
            requestId: 'req_501',
            visitorName: 'Priya Verma',
            phone: '+919876543299',
            category: 'Guest',
            gateName: 'Gate 1',
            timestamp: '10:30 AM',
          },
        ],
      };
    }
    return apiClient.get('/visitors/pending-requests');
  },

  // Resident approves visitor
  async approveVisitor(requestId: string) {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return { success: true, message: 'Visitor approved' };
    }
    return apiClient.post(`/visitors/approve/${requestId}`);
  },

  // Resident rejects visitor
  async rejectVisitor(requestId: string, reason?: string) {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return { success: true, message: 'Visitor rejected' };
    }
    return apiClient.post(`/visitors/reject/${requestId}`, { reason });
  },

  // Get visitor log history
  async getVisitorHistory(filters?: { search?: string; status?: string }) {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return {
        success: true,
        data: [
          {
            id: 'log_1',
            visitorName: 'Priya Verma',
            category: 'Guest',
            entryTime: '10:30 AM',
            exitTime: '11:45 AM',
            status: 'EXITED',
          },
        ],
      };
    }
    const query = new URLSearchParams(filters as any).toString();
    return apiClient.get(`/visitors/history?${query}`);
  },
};
