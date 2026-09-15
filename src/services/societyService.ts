import { apiClient } from './apiClient';

export const societyService = {
  // Fetch user notifications
  async getNotifications() {
    return apiClient.get('/notifications');
  },

  // Mark all notifications as read
  async markAllNotificationsRead() {
    return apiClient.patch('/notifications/read-all');
  },

  // Trigger SOS Emergency alert
  async triggerSOS(flat: string, emergencyType: 'MEDICAL' | 'FIRE' | 'SECURITY' = 'SECURITY') {
    return apiClient.post('/emergency/sos', { flat, emergencyType });
  },

  // Get society news updates
  async getSocietyNews() {
    return apiClient.get('/news');
  },

  // Get society services directory (Emergency numbers, plumber, electrician)
  async getServicesDirectory() {
    return apiClient.get('/services');
  },

  // Family Members Management
  async getFamilyMembers() {
    return apiClient.get('/resident/family');
  },

  async addFamilyMember(data: { name: string; relation: string; phone?: string }) {
    return apiClient.post('/resident/family', data);
  },

  async deleteFamilyMember(id: string) {
    return apiClient.delete(`/resident/family/${id}`);
  },
};

