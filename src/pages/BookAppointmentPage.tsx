
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
          title: "Médico No Encontrado",
          description: "El médico que está buscando no existe",
          variant: "destructive",
        });
        navigate("/doctors");
      }
    }
  }, [doctorId, navigate, toast]);

  const handleBookAppointment = async (timeSlotId: string, date: string, startTime: string, endTime: string) => {
    if (!doctor) return;
    
    try {
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        toast({
          title: "Se Requiere Iniciar Sesión",
          description: "Por favor inicie sesión para reservar una cita",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
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
        title: "Cita Reservada",
        description: "Su cita ha sido reservada exitosamente!",
      });
      
      navigate("/appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Error en la Reserva",
        description: "Hubo un error al reservar su cita",
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
            <h1 className="text-2xl font-bold">Cargando...</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Reservar una Cita</h1>
          <p className="text-gray-600 mt-2">
            Seleccione una fecha y un horario para programar su cita
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
                      <p className="text-xs text-gray-500">Ubicación</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm">(555) 123-4567</p>
                      <p className="text-xs text-gray-500">Teléfono</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm">{doctor.email}</p>
                      <p className="text-xs text-gray-500">Correo</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-md font-semibold mb-2">Sobre el Médico</h3>
                  <p className="text-sm text-gray-600">
                    {doctor.bio || "Profesional de la salud con experiencia brindando atención de calidad a los pacientes."}
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
