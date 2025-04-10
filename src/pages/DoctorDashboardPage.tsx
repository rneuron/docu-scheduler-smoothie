
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/Layout/AppHeader";
import WeeklyCalendar from "@/components/AppointmentComponents/WeeklyCalendar";
import ProfileEditor from "@/components/DoctorComponents/ProfileEditor";
import DoctorProfileCard from "@/components/DoctorComponents/DoctorProfileCard";
import DoctorStats from "@/components/DoctorComponents/DoctorStats";
import PendingAppointmentsSection from "@/components/DoctorComponents/PendingAppointmentsSection";
import AppointmentConfirmationDialog from "@/components/DoctorComponents/AppointmentConfirmationDialog";
import { getCurrentUser, isDoctor } from "@/lib/auth";
import { getUserAppointments, confirmAppointment, markArrival, addDoctor } from "@/lib/appointmentService";
import { useToast } from "@/components/ui/use-toast";
import { Appointment, Doctor } from "@/types";

const DoctorDashboardPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [confirmingAppointmentId, setConfirmingAppointmentId] = useState<string | null>(null);
  const [isConfirmationChecked, setIsConfirmationChecked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        
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
      } catch (error) {
        console.error("Error fetching current user:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información del usuario",
          variant: "destructive",
        });
        navigate("/login");
      }
    };
    
    fetchCurrentUser();
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
  const totalPatients = doctor ? new Set(appointments.map(app => app.patientId)).size : 0;
  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(app => app.status === "confirmed").length;

  const closeConfirmationDialog = () => setConfirmingAppointmentId(null);

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
          <DoctorProfileCard 
            doctor={doctor} 
            totalPatients={totalPatients} 
            onEditProfile={() => setIsProfileEditorOpen(true)} 
          />
        )}
        
        {/* Stats Dashboard */}
        <DoctorStats 
          totalAppointments={totalAppointments}
          confirmedAppointments={confirmedAppointments}
          pendingAppointments={pendingAppointments.length}
        />
        
        {/* Pending Appointments Section */}
        <PendingAppointmentsSection 
          pendingAppointments={pendingAppointments}
          onConfirm={handleConfirmAppointment}
          onMarkArrival={handleMarkArrival}
        />
        
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
      <AppointmentConfirmationDialog 
        isOpen={confirmingAppointmentId !== null}
        onClose={closeConfirmationDialog}
        onConfirm={handleConfirmationProceed}
        isChecked={isConfirmationChecked}
        onCheckedChange={setIsConfirmationChecked}
      />
    </div>
  );
};

export default DoctorDashboardPage;
