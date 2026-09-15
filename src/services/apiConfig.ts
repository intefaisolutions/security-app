import { Platform } from 'react-native';

export const API_CONFIG = {
  // Configured to point directly to backend server
  BASE_URL: Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api',
  TIMEOUT: 10000,
  // Set to false to ensure all requests hit the real backend API
  USE_MOCK_FALLBACK: false,
};

