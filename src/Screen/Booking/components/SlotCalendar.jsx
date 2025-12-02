import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getNext30Days, formatDate } from '../utils/dateHelpers';

export const SlotCalendar = ({ selectedDate, onDateSelect }) => {
  const [startIndex, setStartIndex] = useState(0);
  const days = getNext30Days();
  const visibleDays = days.slice(startIndex, startIndex + 7);

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 7);
    }
  };

  const handleNext = () => {
    if (startIndex + 7 < days.length) {
      setStartIndex(startIndex + 7);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-blue-600" />
          Select Date
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={startIndex === 0}
            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={handleNext}
            disabled={startIndex + 7 >= days.length}
            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {visibleDays.map((day) => {
          const isSelected = selectedDate === day.date;
          
          return (
            <button
              key={day.date}
              onClick={() => onDateSelect(day.date)}
              className={`relative p-2 rounded-xl text-center transition-all ${
                isSelected
                  ? 'bg-[#282828] text-white shadow-md scale-105'
                  : 'bg-[#F0F0F0] hover:bg-blue-50 text-slate-700 border border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                {day.weekday}
              </div>
              <div className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                {day.day}
              </div>
              <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                {day.month}
              </div>
              {day.isToday && !isSelected && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};