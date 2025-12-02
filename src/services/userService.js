import api from './api';

export const userService = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.success) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      if (response.success) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user sessions
  getSessions: async () => {
    try {
      const response = await api.get('/user/sessions');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Terminate specific session
  terminateSession: async (sessionId) => {
    try {
      const response = await api.delete(`/user/sessions/${sessionId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user statistics
  getStats: async () => {
    try {
      const response = await api.get('/user/stats');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete user account
  deleteAccount: async (confirmPassword) => {
    try {
      const response = await api.delete('/user/account', {
        data: { confirmPassword }
      });
      if (response.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
};
