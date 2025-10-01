import React, { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = firstDayOfMonth.getDay(); // Day of week (0-6)
  const daysInMonth = lastDayOfMonth.getDate();

  // Get previous month's last few days
  const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];

    // Previous month's trailing days
    for (let i = startDate - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: true,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day)
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      });
    }

    // Next month's leading days
    const totalCells = 42; // 6 rows × 7 days
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day)
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (date, isCurrentMonth) => {
    if (isCurrentMonth) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="h-max-md w-full bg-white rounded-lg shadow-lg p-2  my-4  ">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={goToPrevMonth}
          className=" hover:bg-gray-100 rounded-full transition-colors"
        >
          <span className="text-gray-600 text-xl">←</span>
        </button>
        
        <h2 className="text-xl font-semibold text-gray-800">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <span className="text-gray-600 text-xl">→</span>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-x-0.5 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayObj, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(dayObj.date, dayObj.isCurrentMonth)}
            className={`
              h-10 w-10 rounded-full text-sm font-medium transition-colors
              ${dayObj.isCurrentMonth 
                ? 'text-gray-900 hover:bg-blue-100' 
                : 'text-gray-400 hover:bg-gray-50'
              }
              ${isToday(dayObj.date) 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : ''
              }
              ${isSelected(dayObj.date) && !isToday(dayObj.date)
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : ''
              }
            `}
          >
            {dayObj.day}
          </button>
        ))}
      </div>

      {/* Selected date display */}
      {selectedDate && (
        <div className="mt-1 p-2 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Selected date:</p>
          <p className="font-medium text-blue-600">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}

      {/* Quick navigation */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Today
        </button>
        <button
          onClick={() => setSelectedDate(new Date())}
          className="px-2 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Select Today
        </button>
      </div>
    </div>
  );
};

export default Calendar;