import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/Layout/AppHeader";
import AppointmentCard from "@/components/AppointmentComponents/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { getCurrentUser, isPatient } from "@/lib/auth";
import { getUserAppointments, confirmAppointment } from "@/lib/appointmentService";
import { useToast } from "@/components/ui/use-toast";
import { Appointment } from "@/types";
import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";

const PatientDashboardPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [confirmingAppointmentId, setConfirmingAppointmentId] = useState<string | null>(null);
  const [isConfirmationChecked, setIsConfirmationChecked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser || !isPatient(currentUser)) {
          toast({
            title: "Access Denied",
            description: "Please log in as a patient to access this page",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
        
        // Get patient appointments
        const userAppointments = getUserAppointments(currentUser.id, "patient");
        setAppointments(userAppointments);
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

  const upcomingAppointments = appointments.filter(
    app => app.status === "confirmed" || app.status === "pending"
  ).slice(0, 3);

  const handleConfirmAppointment = (appointmentId: string) => {
    setConfirmingAppointmentId(appointmentId);
    setIsConfirmationChecked(false);
  };

  const handleConfirmationProceed = () => {
    if (!confirmingAppointmentId) return;
    
    try {
      const updatedAppointment = confirmAppointment(confirmingAppointmentId, "patient");
      
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
        title: "Error en la Confirmación",
        description: "Hubo un error al confirmar la cita",
        variant: "destructive",
      });
    } finally {
      setConfirmingAppointmentId(null);
      setIsConfirmationChecked(false);
    }
  };

  // Calculate overall stats
  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(app => app.status === "confirmed").length;
  const pendingAppointments = appointments.filter(app => app.status === "pending").length;

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel del Paciente</h1>
          <p className="text-gray-600 mt-2">
            Administre sus citas médicas
          </p>
        </div>
        
        {/* Stats Section */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Citas</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Todas sus citas
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
                Listas para su visita
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Esperando confirmación
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Upcoming Appointments Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Próximas Citas</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/appointments")}>
                Ver Todas
              </Button>
              <Button onClick={() => navigate("/doctors")}>
                Solicitar Cita
              </Button>
            </div>
          </div>
          
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-10 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-8 w-8 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No tiene citas próximas</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm">
                  No tiene ninguna cita próxima. ¿Desea agendar una?
                </p>
                <Button className="mt-4" onClick={() => navigate("/doctors")}>
                  Buscar un Médico
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  userType="patient"
                  onConfirm={handleConfirmAppointment}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate("/doctors")}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-medical-100 p-3 rounded-full mb-4">
                  <Calendar className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="font-medium mb-2">Agendar Cita</h3>
                <p className="text-sm text-gray-500">
                  Encuentre un médico y agende una nueva cita
                </p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate("/appointments")}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-medical-100 p-3 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="font-medium mb-2">Administrar Citas</h3>
                <p className="text-sm text-gray-500">
                  Vea, confirme o cancele sus citas existentes
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={confirmingAppointmentId !== null} onOpenChange={() => setConfirmingAppointmentId(null)}>
        <DialogContent>
          <DialogTitle>Confirmar Cita</DialogTitle>
          <DialogDescription>
            Al confirmar esta cita, usted acepta las siguientes condiciones:
          </DialogDescription>
          
          <div className="flex items-start space-x-2 mt-4">
            <Checkbox 
              id="confirmation-checkbox" 
              checked={isConfirmationChecked}
              onCheckedChange={() => setIsConfirmationChecked(!isConfirmationChecked)}
              className="mt-1"
            />
            <label htmlFor="confirmation-checkbox" className="text-sm">
              Entiendo que debo pagar por la cita y que si no asisto, no recibiré un reembolso. Si no confirmo la cita 12 horas antes, esta será cancelada automáticamente.
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
              Confirmar y Proceder al Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDashboardPage;
