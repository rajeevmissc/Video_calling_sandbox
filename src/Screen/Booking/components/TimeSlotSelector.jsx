import { Clock, CheckCircle } from 'lucide-react';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { SLOT_STATUS } from '../constants/bookingConstants';

export const TimeSlotSelector = ({ 
  providerId, 
  selectedDate, 
  selectedTime, 
  onTimeSelect 
}) => {
  const { slots, loading, error } = useAvailableSlots(providerId, selectedDate);
  if (!selectedDate) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        Please select a date first
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-600 text-sm mt-2">Loading available slots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 text-sm">
        Error loading slots: {error}
      </div>
    );
  }

  const availableSlots = slots.filter(slot => slot.status === SLOT_STATUS.AVAILABLE);

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        No slots available for this date
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
        <Clock className="w-4 h-4 text-blue-600" />
        Select Time Slot
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => {
          const isSelected = selectedTime === slot.value;
          const isAvailable = slot.status === SLOT_STATUS.AVAILABLE;
          
          return (
            <button
              key={slot.value}
              onClick={() => isAvailable && onTimeSelect(slot.value)}
              disabled={!isAvailable}
              className={`relative p-3 rounded-lg text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-[#282828] text-white shadow-md scale-105'
                  : isAvailable
                  ? 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 hover:border-blue-300'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
              }`}
            >
              {slot.label}
              {isSelected && (
                <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                </div>
              )}
              {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-full bg-slate-300 rotate-45"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-600 pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded [#282828]"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white border border-slate-200"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};