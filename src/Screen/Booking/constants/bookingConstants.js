export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled'
};

export const SESSION_MODES = {
  CALL: 'call',
  VIDEO: 'video',
  VISIT: 'visit'
};

export const TIME_SLOTS = [
  { value: '09:00', label: '09:00 AM', hour: 9 },
  { value: '10:00', label: '10:00 AM', hour: 10 },
  { value: '11:00', label: '11:00 AM', hour: 11 },
  { value: '12:00', label: '12:00 PM', hour: 12 },
  { value: '14:00', label: '02:00 PM', hour: 14 },
  { value: '15:00', label: '03:00 PM', hour: 15 },
  { value: '16:00', label: '04:00 PM', hour: 16 },
  { value: '17:00', label: '05:00 PM', hour: 17 },
  { value: '18:00', label: '06:00 PM', hour: 18 }
];

export const WALLET_THRESHOLDS = {
  MIN_BOOKING_MULTIPLIER: 5,
  LOW_BALANCE_WARNING: 0.8
};

export const BOOKING_ERRORS = {
  INSUFFICIENT_BALANCE: 'insufficient_balance',
  SLOT_NOT_AVAILABLE: 'slot_not_available',
  INVALID_DATE: 'invalid_date',
  PROVIDER_UNAVAILABLE: 'provider_unavailable'
};

export const SLOT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  BLOCKED: 'blocked'
};