
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

interface WeeklyCalendarProps {
  appointments: Appointment[];
}

const WeeklyCalendar = ({ appointments }: WeeklyCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [days, setDays] = useState<Date[]>([]);
  
  // Set up days of the week
  useEffect(() => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start on Monday
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 }); // End on Sunday
    
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    setDays(daysOfWeek);
  }, [currentWeek]);
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };
  
  // Get appointments for a specific day
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return isSameDay(appointmentDate, day);
    });
  };
  
  // Format time for display
  const formatAppointmentTime = (time: string) => {
    return time.substring(0, 5); // Extract HH:MM from HH:MM:SS
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Calendario Semanal</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="py-2 px-2">
            {format(days[0] || currentWeek, "d MMM", { locale: es })} - {format(days[days.length - 1] || currentWeek, "d MMM yyyy", { locale: es })}
          </span>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div key={index} className="min-h-[120px]">
              <div className="text-center p-2 font-semibold bg-muted rounded-t-md">
                {format(day, "EEEE", { locale: es })}
                <div className="text-sm font-normal">
                  {format(day, "d MMM", { locale: es })}
                </div>
              </div>
              <div className="border rounded-b-md p-2 h-full">
                {getAppointmentsForDay(day).length > 0 ? (
                  <div className="space-y-2">
                    {getAppointmentsForDay(day).map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className={`text-xs p-1 rounded ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 border-l-4 border-green-500' 
                            : 'bg-yellow-100 border-l-4 border-yellow-500'
                        }`}
                      >
                        <div className="font-semibold">{formatAppointmentTime(appointment.startTime)} - {formatAppointmentTime(appointment.endTime)}</div>
                        <div className="truncate">{appointment.patientName}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">
                    Sin citas
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyCalendar;
