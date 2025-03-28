
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppHeader from "@/components/Layout/AppHeader";
import BookingCalendar from "@/components/AppointmentComponents/BookingCalendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail } from "lucide-react";
import { mockDoctors } from "@/data/mockData";
import { Doctor } from "@/types";
import { bookAppointment } from "@/lib/appointmentService";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

const BookAppointmentPage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Find the doctor by ID
    if (doctorId) {
      const foundDoctor = mockDoctors.find(d => d.id === doctorId);
      if (foundDoctor) {
        setDoctor(foundDoctor);
      } else {
        toast({
          title: "Doctor Not Found",
          description: "The doctor you're looking for does not exist",
          variant: "destructive",
        });
        navigate("/doctors");
      }
    }
  }, [doctorId, navigate, toast]);

  const handleBookAppointment = (timeSlotId: string, date: string, startTime: string, endTime: string) => {
    if (!doctor) return;
    
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to book an appointment",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    try {
      const appointmentData = {
        patientId: currentUser.id,
        doctorId: doctor.id,
        timeSlotId: timeSlotId,
        date: date,
        startTime: startTime,
        endTime: endTime,
        specialtyName: doctor.specialty,
        doctorName: doctor.name,
        patientName: currentUser.name,
      };
      
      bookAppointment(appointmentData);
      
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been booked successfully!",
      });
      
      navigate("/appointments");
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment",
        variant: "destructive",
      });
    }
  };

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-600 mt-2">
            Select a date and time slot to schedule your appointment
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={doctor.profileImage} alt={doctor.name} />
                    <AvatarFallback className="bg-medical-200 text-medical-800 text-xl">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{doctor.name}</h2>
                  <Badge className="mt-2">{doctor.specialty}</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm">{doctor.location}</p>
                      <p className="text-xs text-gray-500">Location</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm">(555) 123-4567</p>
                      <p className="text-xs text-gray-500">Phone</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm">{doctor.email}</p>
                      <p className="text-xs text-gray-500">Email</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-md font-semibold mb-2">About</h3>
                  <p className="text-sm text-gray-600">
                    {doctor.bio || "Experienced healthcare professional providing quality care to patients."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <BookingCalendar doctor={doctor} onBookAppointment={handleBookAppointment} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookAppointmentPage;
