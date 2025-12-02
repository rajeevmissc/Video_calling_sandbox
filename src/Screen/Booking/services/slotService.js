import api from '../../../services/api';

export const slotService = {
  
  getAvailableSlots: async (providerId, date) => {
    try {
      const data = await api.get(`/slots/${providerId}?date=${date}`);
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getBookedSlots: async (providerId, date) => {
    try {
      const data = await api.get(`/slots/${providerId}/booked?date=${date}`);
      return data.data || [];
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      return [];
    }
  },

  isSlotAvailable: async (providerId, date, timeSlot) => {
    try {
      const bookedSlots = await slotService.getBookedSlots(providerId, date);
      return !bookedSlots.includes(timeSlot);
    } catch (error) {
      console.error('Error checking slot availability:', error);
      return false;
    }
  },

  reserveSlot: async (providerId, date, timeSlot) => {
    try {
      const data = await api.post('/slots/reserve', { providerId, date, timeSlot });
      return { success: true, reservationId: data.reservationId, expiresIn: data.expiresIn };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  confirmSlot: async (providerId, date, timeSlot, bookingId) => {
    try {
      const data = await api.post('/slots/book', { providerId, date, timeSlot, bookingId });
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
