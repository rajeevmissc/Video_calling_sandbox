import api from './api';

export const authService = {
  // Send OTP to phone number
  sendOTP: async (phoneNumber, countryCode, purpose = 'login') => {
    try {
      const response = await api.post('/auth/send-otp', {
        phoneNumber: phoneNumber.replace(/\D/g, ''),
        countryCode,
        purpose
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP and login
  verifyOTP: async (phoneNumber, otp, deviceInfo = {}) => {
    try {
      const response = await api.post('/auth/verify-otp', {
        phoneNumber,
        otp,
        deviceInfo: {
          platform: navigator.platform,
          userAgent: navigator.userAgent,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...deviceInfo
        }
      });
      
      // Store token and user data
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Resend OTP
  resendOTP: async (phoneNumber) => {
    try {
      const response = await api.post('/auth/resend-otp', {
        phoneNumber
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout current session
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      return { success: true };
    } catch (error) {
      // Still clear local storage even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      throw error;
    }
  },

  // Logout all sessions
  logoutAll: async () => {
    try {
      await api.post('/auth/logout-all');
      localStorage.removeItem('token');
      localStorage.removeUser('userData');
      return { success: true };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    return !!(token && userData);
  },

  // Get current user data
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  }
};