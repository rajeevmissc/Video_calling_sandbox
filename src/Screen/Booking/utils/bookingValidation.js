import { WALLET_THRESHOLDS, BOOKING_ERRORS } from '../constants/bookingConstants';
import { isFutureDate } from './dateHelpers';

export const validateBooking = (bookingData, walletBalance) => {
  const errors = [];

  // Validate date
  if (!bookingData.date || !isFutureDate(bookingData.date)) {
    errors.push({
      type: BOOKING_ERRORS.INVALID_DATE,
      message: 'Please select a valid future date'
    });
  }

  // Validate time slot
  if (!bookingData.timeSlot) {
    errors.push({
      type: 'invalid_time',
      message: 'Please select a time slot'
    });
  }

 // Validate wallet balance
const requiredBalance =
  bookingData.mode === "visit"
    ? bookingData.price     // only 1× for visit
    : bookingData.price; // 5× for call/chat

if (walletBalance < requiredBalance) {
  errors.push({
    type: BOOKING_ERRORS.INSUFFICIENT_BALANCE,
    message: `Insufficient balance. Required: ₹${requiredBalance}`,
    requiredAmount: requiredBalance,
    currentBalance: walletBalance,
    shortfall: requiredBalance - walletBalance
  });
}


  return {
    isValid: errors.length === 0,
    errors
  };
};

// export const checkWalletThreshold = (walletBalance, servicePrice) => {
//   const requiredBalance = servicePrice * WALLET_THRESHOLDS.MIN_BOOKING_MULTIPLIER;
//   const warningThreshold = requiredBalance * WALLET_THRESHOLDS.LOW_BALANCE_WARNING;

//   return {
//     hasEnoughBalance: walletBalance >= requiredBalance,
//     showWarning: walletBalance < requiredBalance && walletBalance >= warningThreshold,
//     requiredBalance,
//     shortfall: Math.max(0, requiredBalance - walletBalance)
//   };
// };

export const checkWalletThreshold = (walletBalance, requiredAmount) => {
  const warningThreshold = requiredAmount * WALLET_THRESHOLDS.LOW_BALANCE_WARNING;

  return {
    hasEnoughBalance: walletBalance >= requiredAmount,
    showWarning: walletBalance < requiredAmount && walletBalance >= warningThreshold,
    requiredBalance: requiredAmount,
    shortfall: Math.max(0, requiredAmount - walletBalance)
  };
};
