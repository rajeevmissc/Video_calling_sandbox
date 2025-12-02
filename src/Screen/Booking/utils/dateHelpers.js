export const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const formatDisplayDate = (date) => {
  if (!date) return 'Date not set';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatTime = (timeStr) => {
  // Add null check and default value
  if (!timeStr) return 'Time not set';
  
  try {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
};

export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

export const isFutureDate = (date) => {
  if (!date) return false;

  const today = new Date().toISOString().split("T")[0]; 
  const selected = new Date(date).toISOString().split("T")[0];

  return selected >= today;
};


export const getNext30Days = () => {
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: formatDate(date),
      day: date.getDate(),
      month: date.toLocaleDateString('en-IN', { month: 'short' }),
      weekday: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      isToday: i === 0
    });
  }
  
  return days;
};

export const combineDateTime = (date, time) => {
  if (!date || !time) return null;
  return `${date}T${time}:00`;
};