import api from '../../../services/api';

export const bookingService = {
  
  createBooking: async (bookingData) => {
    try {
      const data = await api.post('/bookings', bookingData);
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getUserBookings: async () => {
    try {
      const data = await api.get('/bookings/user');
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get provider bookings (NEW)
  getProviderBookings: async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const endpoint = queryString ? `/bookings/provider?${queryString}` : '/bookings/provider';
      const data = await api.get(endpoint);
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getAllBookings: async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const endpoint = queryString ? `/bookings/admin/all?${queryString}` : '/bookings/admin/all';
      const data = await api.get(endpoint);
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      const data = await api.patch(`/bookings/${bookingId}/status`, { status });
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      const data = await api.delete(`/bookings/${bookingId}`);
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};