import { useState, useEffect, useCallback } from 'react';
import { slotService } from '../services/slotService';
import { SLOT_STATUS } from '../constants/bookingConstants';

export const useAvailableSlots = (providerId, selectedDate) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSlots = useCallback(async () => {
    if (!providerId || !selectedDate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await slotService.getAvailableSlots(providerId, selectedDate);
      if (response.success) {
        setSlots(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [providerId, selectedDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const getAvailableSlots = useCallback(() => {
    return slots.filter(slot => slot.status === SLOT_STATUS.AVAILABLE);
  }, [slots]);

  const isSlotAvailable = useCallback((timeSlot) => {
    const slot = slots.find(s => s.value === timeSlot);
    return slot && slot.status === SLOT_STATUS.AVAILABLE;
  }, [slots]);

  return {
    slots,
    loading,
    error,
    fetchSlots,
    getAvailableSlots,
    isSlotAvailable
  };
};