
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/Layout/AppHeader";
import AppointmentCard from "@/components/AppointmentComponents/AppointmentCard";
import WeeklyCalendar from "@/components/AppointmentComponents/WeeklyCalendar";
import ProfileEditor from "@/components/DoctorComponents/ProfileEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser, isDoctor } from "@/lib/auth";
import { getUserAppointments, confirmAppointment, markArrival, addDoctor } from "@/lib/appointmentService";
import { useToast } from "@/components/ui/use-toast";
import { Appointment, Doctor } from "@/types";
import { Calendar, CheckCircle, Clock, AlertTriangle, User, MapPin, AlertDialog } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const DoctorDashboardPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [confirmingAppointmentId, setConfirmingAppointmentId] = useState<string | null>(null);
  const [isConfirmationChecked, setIsConfirmationChecked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (!currentUser || !isDoctor(currentUser)) {
      toast({
        title: "Acceso Denegado",
        description: "Por favor inicie sesión como médico para acceder a esta página",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setDoctor(currentUser);
    
    // Get doctor appointments
    const doctorAppointments = getUserAppointments(currentUser.id, "doctor");
    setAppointments(doctorAppointments);
  }, [navigate, toast]);

  // Filter pending appointments
  const pendingAppointments = appointments.filter(
    app => app.status === "pending" && !app.doctorConfirmed
  ).slice(0, 3);

  const handleConfirmAppointment = (appointmentId: string) => {
    setConfirmingAppointmentId(appointmentId);
    setIsConfirmationChecked(false);
  };

  const handleConfirmationProceed = () => {
    if (!confirmingAppointmentId) return;
    
    try {
      const updatedAppointment = confirmAppointment(confirmingAppointmentId, "doctor");
      
      if (updatedAppointment) {
        // Update the appointments state
        setAppointments(prevAppointments => 
          prevAppointments.map(app => 
            app.id === confirmingAppointmentId ? updatedAppointment : app
          )
        );
        
        toast({
          title: "Cita Confirmada",
          description: "Ha confirmado la cita exitosamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error de Confirmación",
        description: "Hubo un error al confirmar la cita",
        variant: "destructive",
      });
    } finally {
      setConfirmingAppointmentId(null);
      setIsConfirmationChecked(false);
    }
  };

  const handleMarkArrival = (appointmentId: string, minutesLate: number) => {
    try {
      markArrival(appointmentId, "doctor", minutesLate);
      
      toast({
        title: "Llegada del Paciente Registrada",
        description: `El paciente ha sido marcado como ${minutesLate > 15 ? "tarde" : "a tiempo"} (${minutesLate} minutos).`,
      });
      
      // In a real app, this would trigger penalties or refunds if applicable
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al registrar la llegada del paciente",
        variant: "destructive",
      });
    }
  };

  // Handler for updating doctor profile
  const handleUpdateProfile = (updatedDoctor: Doctor) => {
    if (doctor) {
      // In a real app, this would be an API call to update the doctor's profile
      const newDoctor = addDoctor({
        name: updatedDoctor.name,
        specialty: updatedDoctor.specialty,
        location: updatedDoctor.location, 
        profileImage: updatedDoctor.profileImage,
        email: updatedDoctor.email,
        userType: "doctor"
      });
      
      // Update local state
      setDoctor({
        ...newDoctor,
        name: updatedDoctor.name,
        specialty: updatedDoctor.specialty,
        profileImage: updatedDoctor.profileImage
      });
    }
  };

  // Calculate overall stats
  const totalPatients = new Set(appointments.map(app => app.patientId)).size;
  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(app => app.status === "confirmed").length;

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel del Médico</h1>
          <p className="text-gray-600 mt-2">
            Administre su horario y citas de pacientes
          </p>
        </div>
        
        {/* Doctor Profile Card */}
        {doctor && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 flex justify-center mb-4 md:mb-0 md:mr-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={doctor.profileImage} alt={doctor.name} />
                    <AvatarFallback className="bg-medical-200 text-medical-800 text-xl">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-2xl font-bold">{doctor.name}</h2>
                  <p className="text-medical-600 font-medium">{doctor.specialty}</p>
                  
                  <div className="mt-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <div className="flex items-center justify-center md:justify-start">
                      <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600">{doctor.location}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <User className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600">{totalPatients} Pacientes Totales</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex justify-center">
                  <Button variant="outline" onClick={() => setIsProfileEditorOpen(true)}>
                    Editar Perfil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Stats Section */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Citas Totales</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Todas las citas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Listas para visitas de pacientes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Esperando confirmación
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Pending Appointments Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Confirmaciones Pendientes</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/appointments")}>
                Ver Todas las Citas
              </Button>
              <Button onClick={() => navigate("/book-appointment/new")}>
                Crear Cita
              </Button>
            </div>
          </div>
          
          {pendingAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-10 flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No hay confirmaciones pendientes</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm">
                  No tiene citas que necesiten su confirmación.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pendingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  userType="doctor"
                  onConfirm={handleConfirmAppointment}
                  onMarkArrival={handleMarkArrival}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Weekly Calendar */}
        <WeeklyCalendar appointments={appointments} />
      </main>
      
      {/* Profile Editor Dialog */}
      {doctor && (
        <ProfileEditor
          doctor={doctor}
          open={isProfileEditorOpen}
          onClose={() => setIsProfileEditorOpen(false)}
          onUpdate={handleUpdateProfile}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmingAppointmentId !== null} onOpenChange={() => setConfirmingAppointmentId(null)}>
        <DialogContent>
          <DialogTitle>Confirmar Cita</DialogTitle>
          <DialogDescription>
            Al confirmar esta cita, usted está aceptando la siguiente condición:
          </DialogDescription>
          
          <div className="flex items-start space-x-2 mt-4">
            <Checkbox 
              id="confirmation-checkbox" 
              checked={isConfirmationChecked}
              onCheckedChange={() => setIsConfirmationChecked(!isConfirmationChecked)}
              className="mt-1"
            />
            <label htmlFor="confirmation-checkbox" className="text-sm">
              Entiendo que si llego más de 15 minutos tarde a esta cita, debo ofrecerla sin costo para el paciente. Estoy de acuerdo con esta política.
            </label>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmingAppointmentId(null)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmationProceed} 
              disabled={!isConfirmationChecked}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboardPage;
