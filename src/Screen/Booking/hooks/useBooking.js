import { useState, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { validateBooking } from '../utils/bookingValidation';

export const useBooking = () => {
  const [bookingState, setBookingState] = useState({
    selectedMode: 'video',
    selectedDate: null,
    selectedTime: null,
    isProcessing: false,
    error: null,
    success: false
  });

  const updateBookingState = useCallback((updates) => {
    setBookingState(prev => ({ ...prev, ...updates }));
  }, []);

  const setSelectedMode = useCallback((mode) => {
    updateBookingState({ selectedMode: mode });
  }, [updateBookingState]);

  const setSelectedDate = useCallback((date) => {
    updateBookingState({ selectedDate: date, selectedTime: null });
  }, [updateBookingState]);

  const setSelectedTime = useCallback((time) => {
    updateBookingState({ selectedTime: time });
  }, [updateBookingState]);

  const validateAndBook = useCallback(async (provider, walletBalance, onSuccess) => {
    const { selectedMode, selectedDate, selectedTime } = bookingState;
    
    const bookingData = {
      date: selectedDate,
      timeSlot: selectedTime,
      price: provider.pricing[selectedMode].basePrice,
      mode: selectedMode
    };

    // Validate booking
    const validation = validateBooking(bookingData, walletBalance);
    
    if (!validation.isValid) {
      updateBookingState({ 
        error: validation.errors[0].message 
      });
      return { success: false, errors: validation.errors };
    }

    // Process booking
    updateBookingState({ isProcessing: true, error: null });
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    try {
      const fullBookingData = {
        ...bookingData,
        providerId: provider._id,
        providerName: provider.personalInfo.fullName,
        userId: userData._id, // Replace with actual user ID
        duration: provider.pricing[selectedMode].duration
      };

      const response = await bookingService.createBooking(fullBookingData);
      
      if (response.success) {
        updateBookingState({ 
          success: true, 
          isProcessing: false 
        });
        
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        return { success: true, data: response.data };
      } else {
        updateBookingState({ 
          error: response.error, 
          isProcessing: false 
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      updateBookingState({ 
        error: error.message, 
        isProcessing: false 
      });
      return { success: false, error: error.message };
    }
  }, [bookingState, updateBookingState]);

  const resetBooking = useCallback(() => {
    setBookingState({
      selectedMode: 'video',
      selectedDate: null,
      selectedTime: null,
      isProcessing: false,
      error: null,
      success: false
    });
  }, []);

  return {
    ...bookingState,
    setSelectedMode,
    setSelectedDate,
    setSelectedTime,
    validateAndBook,
    resetBooking
  };
};