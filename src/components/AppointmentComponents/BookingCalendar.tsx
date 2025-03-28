
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { TimeSlot, Doctor, User } from "@/types";
import { getAvailableTimeSlots } from "@/lib/appointmentService";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface BookingCalendarProps {
  doctor: Doctor;
  onBookAppointment: (timeSlotId: string, date: string, startTime: string, endTime: string) => void;
}

const BookingCalendar = ({ doctor, onBookAppointment }: BookingCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (date && doctor) {
      // Get slots for the selected date and doctor
      const formattedDate = format(date, "yyyy-MM-dd");
      const slots = getAvailableTimeSlots(doctor.id);
      const filteredSlots = slots.filter(slot => slot.date === formattedDate);
      setAvailableSlots(filteredSlots);
      setSelectedSlot(null);
    }
  }, [date, doctor]);

  const handleTimeSlotClick = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book an appointment",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (selectedSlot) {
      onBookAppointment(
        selectedSlot.id,
        selectedSlot.date,
        selectedSlot.startTime,
        selectedSlot.endTime
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label className="text-base font-medium mb-2 block">Select Date</Label>
          <Card>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={{ before: new Date() }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Label className="text-base font-medium mb-2 block">Available Time Slots</Label>
          <Card>
            <CardContent className="p-4">
              {availableSlots.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">
                    No available slots for this date. Please select another date.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                      className={`justify-start ${selectedSlot?.id === slot.id ? "border-2 border-medical-500" : ""}`}
                      onClick={() => handleTimeSlotClick(slot)}
                    >
                      {slot.startTime} - {slot.endTime}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="pt-4">
        <Button
          className="w-full"
          size="lg"
          disabled={!selectedSlot}
          onClick={handleBookAppointment}
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
};

export default BookingCalendar;
