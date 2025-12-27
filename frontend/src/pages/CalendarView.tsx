import { addDays, addMonths, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format, startOfWeek as getStartOfWeek, isToday, startOfMonth, startOfWeek, subMonths, subWeeks } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus, X } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import { useApp } from '../context/AppContext';

type ViewMode = 'week' | 'month';

interface EventFormData {
  date: Date;
  time: string;
  subject: string;
  equipmentId: string;
  duration: number; // in hours
}

export default function CalendarView() {
  const { requests, equipment, loading, error, addRequest } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [eventForm, setEventForm] = useState<EventFormData>({
    date: new Date(),
    time: '09:00',
    subject: '',
    equipmentId: '',
    duration: 1
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#714B67] mx-auto mb-4"></div>
          <p className="text-odoo-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const preventiveRequests = requests.filter(req => req.type === 'preventive' && req.scheduledDate);

  const getEventsForDate = (date: Date) => {
    return preventiveRequests.filter(req => {
      if (!req.scheduledDate) return false;
      const eventDate = new Date(req.scheduledDate);
      // Compare only the date part, ignoring time
      return eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate();
    });
  };

  const getEventsForTimeSlot = (date: Date, hour: number) => {
    return preventiveRequests.filter(req => {
      if (!req.scheduledDate) return false;
      const eventDate = new Date(req.scheduledDate);
      return eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate() &&
             eventDate.getHours() === hour;
    });
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedSlot({ date, time });
    setEventForm({
      ...eventForm,
      date,
      time,
      subject: '',
      equipmentId: '',
      duration: 1
    });
    setShowEventModal(true);
  };

  const handleCreateEvent = async () => {
    if (!eventForm.subject || !eventForm.equipmentId) {
      setToastMessage('Please fill in all required fields');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine date and time into a single ISO string
      const [hours, minutes] = eventForm.time.split(':');
      const scheduledDateTime = new Date(eventForm.date);
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Find selected equipment to get its details
      const selectedEquipment = equipment.find(eq => eq.id === eventForm.equipmentId);
      
      if (!selectedEquipment) {
        throw new Error('Equipment not found');
      }

      await addRequest({
        subject: eventForm.subject,
        type: 'preventive',
        description: `Scheduled preventive maintenance for ${selectedEquipment.name}`,
        equipmentId: eventForm.equipmentId,
        equipmentName: selectedEquipment.name,
        equipmentCategory: selectedEquipment.category,
        maintenanceTeamId: selectedEquipment.maintenanceTeamId,
        maintenanceTeamName: '', // Will be filled by backend
        scheduledDate: scheduledDateTime.toISOString(),
        stage: 'scheduled',
        priority: 'medium',
        duration: eventForm.duration,
        hoursSpent: 0,
        isOverdue: false
      });

      // Show success message
      setToastMessage('Maintenance schedule created successfully');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      // Close modal and reset form
      setShowEventModal(false);
      setEventForm({
        date: new Date(),
        time: '09:00',
        subject: '',
        equipmentId: '',
        duration: 1
      });
    } catch (err: any) {
      console.error('Failed to create event:', err);
      setToastMessage(err.message || 'Failed to create maintenance schedule. Please try again.');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateBack = () => {
    setCurrentDate(viewMode === 'week' ? subWeeks(currentDate, 1) : subMonths(currentDate, 1));
  };

  const navigateForward = () => {
    setCurrentDate(viewMode === 'week' ? addWeeks(currentDate, 1) : addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDateRange = () => {
    if (viewMode === 'week') {
      const weekStart = getStartOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
      const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: startDate, end: endDate });
    }
  };

  const dateRange = getDateRange();
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  return (
    <div className="h-full flex flex-col">
      {/* Toast Notifications */}
      {showSuccessToast && (
        <Toast 
          type="success"
          title="Success!"
          message={toastMessage}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
      {showErrorToast && (
        <Toast 
          type="error"
          title="Error!"
          message={toastMessage}
          onClose={() => setShowErrorToast(false)}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-odoo-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="text-[#714B67]" size={24} />
            <h1 className="text-lg font-semibold text-odoo-gray-900">Maintenance Calendar</h1>
          </div>
          <Button 
            size="sm"
            onClick={() => {
              setEventForm({
                date: new Date(),
                time: '09:00',
                subject: '',
                equipmentId: '',
                duration: 1
              });
              setShowEventModal(true);
            }}
          >
            <Plus size={16} className="mr-1.5" />
            New Schedule
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-odoo-border px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={navigateBack}
              className="p-1.5 hover:bg-odoo-gray-100 rounded transition"
            >
              <ChevronLeft size={18} className="text-odoo-gray-700" />
            </button>
            <button
              onClick={navigateForward}
              className="p-1.5 hover:bg-odoo-gray-100 rounded transition"
            >
              <ChevronRight size={18} className="text-odoo-gray-700" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-odoo-gray-700 hover:bg-gray-100 rounded transition"
            >
              Today
            </button>
            <div className="ml-2 text-base font-semibold text-odoo-gray-900">
              {viewMode === 'week' 
                ? `${format(dateRange[0], 'MMM d')} - ${format(dateRange[6], 'd, yyyy')}`
                : format(currentDate, 'MMMM yyyy')
              }
            </div>
          </div>

          <div className="flex items-center gap-1 bg-odoo-gray-100 rounded p-0.5">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded transition ${
                viewMode === 'week'
                  ? 'bg-white text-[#714B67] shadow-sm'
                  : 'text-odoo-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded transition ${
                viewMode === 'month'
                  ? 'bg-white text-[#714B67] shadow-sm'
                  : 'text-odoo-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-hidden bg-odoo-gray-50">
        {viewMode === 'week' ? (
          <WeekView 
            dateRange={dateRange} 
            timeSlots={timeSlots} 
            getEventsForTimeSlot={getEventsForTimeSlot}
            onTimeSlotClick={handleTimeSlotClick}
          />
        ) : (
          <MonthView 
            dateRange={dateRange} 
            currentDate={currentDate} 
            getEventsForDate={getEventsForDate}
            onDayClick={(date: Date) => handleTimeSlotClick(date, '09:00')}
          />
        )}
      </div>

      {/* Event Creation Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-odoo-border">
              <h2 className="text-lg font-semibold text-odoo-gray-900">Schedule Maintenance</h2>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-1 hover:bg-odoo-gray-100 rounded transition"
              >
                <X size={20} className="text-odoo-gray-600" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-odoo-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={eventForm.subject}
                  onChange={(e) => setEventForm({ ...eventForm, subject: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-odoo-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-odoo-primary/20 focus:border-odoo-primary disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="e.g., Monthly maintenance check"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-odoo-gray-700 mb-1">
                  Equipment <span className="text-red-500">*</span>
                </label>
                <select
                  value={eventForm.equipmentId}
                  onChange={(e) => setEventForm({ ...eventForm, equipmentId: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-odoo-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-odoo-primary/20 focus:border-odoo-primary disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">Select equipment</option>
                  {equipment.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-odoo-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={format(eventForm.date, 'yyyy-MM-dd')}
                    onChange={(e) => setEventForm({ ...eventForm, date: new Date(e.target.value) })}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-odoo-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-odoo-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-odoo-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-odoo-gray-700 mb-1">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={eventForm.duration}
                  onChange={(e) => setEventForm({ ...eventForm, duration: parseFloat(e.target.value) })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-odoo-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-odoo-border bg-odoo-gray-50">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowEventModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateEvent}
                disabled={!eventForm.subject || !eventForm.equipmentId || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Week View Component (Teams-style with time slots)
function WeekView({ dateRange, timeSlots, getEventsForTimeSlot, onTimeSlotClick }: any) {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  return (
    <div className="h-full overflow-auto">
      <div className="min-w-[900px]">
        {/* Day Headers */}
        <div className="sticky top-0 z-10 bg-white border-b border-odoo-border">
          <div className="grid grid-cols-[80px_repeat(7,1fr)]">
            <div className="border-r border-odoo-border"></div>
            {dateRange.map((date: Date) => {
              const isTodayDate = isToday(date);
              return (
                <div
                  key={date.toISOString()}
                  className="text-center py-2 border-r border-odoo-border"
                >
                  <div className="text-xs text-odoo-gray-600 font-medium">
                    {format(date, 'EEE')}
                  </div>
                  <div className={`text-lg font-semibold mt-0.5 ${
                    isTodayDate ? 'text-white bg-[#714B67] rounded-full w-8 h-8 flex items-center justify-center mx-auto' : 'text-odoo-gray-900'
                  }`}>
                    {format(date, 'd')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Grid */}
        <div className="relative">
          {timeSlots.map((time: string, hour: number) => (
            <div key={time} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-odoo-border">
              <div className="text-xs text-odoo-gray-600 text-right pr-2 pt-1 border-r border-odoo-border bg-white h-12">
                {time}
              </div>
              {dateRange.map((date: Date) => {
                const slotKey = `${format(date, 'yyyy-MM-dd')}-${hour}`;
                const events = getEventsForTimeSlot(date, hour);
                const isHovered = hoveredSlot === slotKey;
                const isTodayDate = isToday(date);
                
                return (
                  <div
                    key={date.toISOString()}
                    className={`h-12 border-r border-odoo-border relative group ${
                      isTodayDate ? 'bg-purple-50/30' : 'bg-white'
                    } ${isHovered ? 'bg-purple-50' : 'hover:bg-gray-50'} transition cursor-pointer`}
                    onClick={() => onTimeSlotClick(date, time)}
                    onMouseEnter={() => setHoveredSlot(slotKey)}
                    onMouseLeave={() => setHoveredSlot(null)}
                  >
                    {/* Plus icon on hover */}
                    {isHovered && events.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Plus size={16} className="text-[#714B67]" />
                      </div>
                    )}

                    {/* Events */}
                    {events.map((event: any) => {
                      const eventDate = new Date(event.scheduledDate);
                      const eventHour = eventDate.getHours();
                      const duration = event.duration || 1; // hours
                      
                      return (
                        <div
                          key={event.id}
                          className="absolute inset-x-1 top-0.5 bg-[#714B67]/10 border-l-2 border-[#714B67] rounded px-2 py-1.5 text-xs overflow-hidden z-10 hover:bg-[#714B67]/20 transition cursor-pointer"
                          style={{ 
                            height: `${duration * 48 - 4}px`, // 48px per hour minus padding
                            minHeight: '44px'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle event click/edit
                          }}
                        >
                          <div className="font-medium text-[#714B67] truncate">
                            {event.subject}
                          </div>
                          <div className="text-odoo-gray-600 truncate text-[10px] mt-0.5">
                            <Clock size={10} className="inline mr-0.5" />
                            {format(eventDate, 'HH:mm')} • {event.equipmentName}
                          </div>
                          {duration > 1 && (
                            <div className="text-odoo-gray-600 text-[10px] mt-1">
                              {duration}h duration
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Month View Component
function MonthView({ dateRange, currentDate, getEventsForDate, onDayClick }: any) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="h-full p-4">
      <div className="bg-white rounded shadow-odoo h-full flex flex-col">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-odoo-border">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-center py-2 text-xs font-semibold text-odoo-gray-700 border-r border-odoo-border last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr">
          {dateRange.map((date: Date) => {
            const events = getEventsForDate(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isTodayDate = isToday(date);

            return (
              <div
                key={date.toISOString()}
                className={`border-r border-b border-odoo-border last:border-r-0 p-1.5 group ${
                  !isCurrentMonth ? 'bg-odoo-gray-50' : 'bg-white hover:bg-purple-50/50'
                } transition cursor-pointer`}
                onClick={() => onDayClick(date)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${
                    isTodayDate
                      ? 'bg-[#714B67] text-white rounded-full w-6 h-6 flex items-center justify-center'
                      : isCurrentMonth
                      ? 'text-odoo-gray-900'
                      : 'text-odoo-gray-400'
                  }`}>
                    {format(date, 'd')}
                  </span>
                  <Plus 
                    size={14} 
                    className="text-[#714B67] opacity-0 group-hover:opacity-100 transition" 
                  />
                </div>

                <div className="space-y-0.5">
                  {events.slice(0, 3).map((event: any) => {
                    const eventDate = new Date(event.scheduledDate);
                    return (
                      <div
                        key={event.id}
                        className="text-[10px] bg-[#714B67]/10 text-[#714B67] px-1.5 py-0.5 rounded truncate font-medium hover:bg-[#714B67]/20 transition"
                        title={`${format(eventDate, 'HH:mm')} - ${event.subject} - ${event.equipmentName}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle event click
                        }}
                      >
                        <Clock size={8} className="inline mr-0.5" />
                        {format(eventDate, 'HH:mm')} {event.subject}
                      </div>
                    );
                  })}
                  {events.length > 3 && (
                    <div className="text-[10px] text-odoo-gray-600 px-1.5 font-medium">
                      +{events.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
