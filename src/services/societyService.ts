import { apiClient } from './apiClient';
import { API_CONFIG } from './apiConfig';

export const societyService = {
  // Fetch user notifications
  async getNotifications() {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return {
        success: true,
        data: [
          {
            id: '1',
            title: 'Visitor Approved',
            message: 'Arjun Mehta approved Priya Verma',
            time: '1 min ago',
            type: 'approved',
            read: false,
          },
          {
            id: '2',
            title: 'Emergency Alert',
            message: 'SOS from Flat C-0802',
            time: '2 hr ago',
            type: 'emergency',
            read: false,
          },
        ],
      };
    }
    return apiClient.get('/notifications');
  },

  // Mark all notifications as read
  async markAllNotificationsRead() {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return { success: true, message: 'All notifications marked as read' };
    }
    return apiClient.patch('/notifications/read-all');
  },

  // Trigger SOS Emergency alert
  async triggerSOS(flat: string, emergencyType: 'MEDICAL' | 'FIRE' | 'SECURITY' = 'SECURITY') {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return {
        success: true,
        message: 'SOS Alert dispatched to Gate Guard & Control Room',
      };
    }
    return apiClient.post('/emergency/sos', { flat, emergencyType });
  },

  // Get society news updates
  async getSocietyNews() {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return {
        success: true,
        data: [
          {
            id: '1',
            title: 'Annual Society Maintenance Meeting',
            date: 'Sep 15, 2026',
            summary: 'Join us at the clubhouse at 6 PM for the quarterly discussion.',
            category: 'Notice',
          },
        ],
      };
    }
    return apiClient.get('/society/news');
  },

  // Get society services directory (Emergency numbers, plumber, electrician)
  async getServicesDirectory() {
    if (API_CONFIG.USE_MOCK_FALLBACK) {
      return {
        success: true,
        data: [
          { id: '1', name: 'Main Gate Guard Room', phone: '+919876543210', type: 'Emergency' },
          { id: '2', name: 'Society Electrician', phone: '+919876543211', type: 'Maintenance' },
        ],
      };
    }
    return apiClient.get('/society/services');
  },
};
