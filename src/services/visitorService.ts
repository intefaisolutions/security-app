import { apiClient } from './apiClient';

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
    return apiClient.post('/visitors/pre-approve', params);
  },

  // Get active visitor passes for resident
  async getActivePasses() {
    return apiClient.get('/visitors/passes');
  },

  // Cancel / Revoke a visitor pass
  async revokePass(passId: string) {
    return apiClient.delete(`/visitors/passes/${passId}`);
  },

  // Fetch pending approval requests for resident
  async getPendingRequests() {
    return apiClient.get('/visitors/pending-requests');
  },

  // Resident approves visitor
  async approveVisitor(requestId: string) {
    return apiClient.post(`/visitors/approve/${requestId}`);
  },

  // Resident rejects visitor
  async rejectVisitor(requestId: string, reason?: string) {
    return apiClient.post(`/visitors/reject/${requestId}`, { reason });
  },

  // Get visitor log history
  async getVisitorHistory(filters?: { search?: string; status?: string }) {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    const queryString = params.toString();
    const endpoint = queryString ? `/visitors/history?${queryString}` : '/visitors/history';
    return apiClient.get(endpoint);
  },
};

