import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useApp } from '../context/AppContext';

export default function CalendarView() {
  const { requests } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const preventiveRequests = requests.filter(req => req.type === 'preventive' && req.scheduledDate);

  const getEventsForDate = (date: Date) => {
    return preventiveRequests.filter(req => 
      req.scheduledDate && isSameDay(new Date(req.scheduledDate), date)
    );
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-600 mt-2">Preventive maintenance schedule</p>
        </div>
        <Button variant="primary">
          <Plus size={20} className="mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      <Card>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Week Day Headers */}
          {weekDays.map(day => (
            <div key={day} className="text-center font-semibold text-gray-700 py-2">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {dateRange.map(date => {
            const events = getEventsForDate(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = isSameDay(date, new Date());

            return (
              <div
                key={date.toISOString()}
                className={`min-h-24 p-2 border rounded-lg ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'border-odoo-primary border-2' : 'border-gray-200'}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-odoo-primary' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {format(date, 'd')}
                </div>
                
                <div className="space-y-1">
                  {events.map(event => (
                    <div
                      key={event.id}
                      className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1 truncate cursor-pointer hover:bg-blue-200 transition-colors"
                      title={`${event.equipmentName} - ${event.subject}`}
                    >
                      {event.equipmentName}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Upcoming Events List */}
      <div className="mt-6">
        <Card>
          <h3 className="text-xl font-bold mb-4">Upcoming Preventive Maintenance</h3>
          <div className="space-y-3">
            {preventiveRequests
              .filter(req => req.scheduledDate && new Date(req.scheduledDate) >= new Date())
              .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
              .slice(0, 5)
              .map(request => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">{request.subject}</h4>
                    <p className="text-sm text-gray-600">{request.equipmentName}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {format(new Date(request.scheduledDate!), 'MMM dd, yyyy')}
                    </div>
                    <Badge variant="info">{request.maintenanceTeamName}</Badge>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
