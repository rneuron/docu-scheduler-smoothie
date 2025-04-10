
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/Layout/AppHeader";
import AppointmentCard from "@/components/AppointmentComponents/AppointmentCard";
import PaymentModal from "@/components/AppointmentComponents/PaymentModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Appointment } from "@/types";
import { getCurrentUser, isDoctor, isPatient } from "@/lib/auth";
import { getUserAppointments, confirmAppointment, markArrival } from "@/lib/appointmentService";
import { useToast } from "@/components/ui/use-toast";
import { CalendarX } from "lucide-react";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  const [confirmingAppointmentId, setConfirmingAppointmentId] = useState<string | null>(null);
  const [isConfirmationChecked, setIsConfirmationChecked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      toast({
        title: "Se Requiere Iniciar Sesión",
        description: "Por favor inicie sesión para ver sus citas",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    // Set user type
    if (isDoctor(currentUser)) {
      setUserType("doctor");
    } else if (isPatient(currentUser)) {
      setUserType("patient");
    }
    
    // Get user appointments
    const userAppointments = getUserAppointments(currentUser.id, currentUser.userType);
    setAppointments(userAppointments);
  }, [navigate, toast]);

  useEffect(() => {
    // Filter appointments based on the selected tab
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    if (selectedTab === "upcoming") {
      setFilteredAppointments(
        appointments.filter(
          app => app.date >= todayStr && ["pending", "confirmed"].includes(app.status)
        )
      );
    } else if (selectedTab === "past") {
      setFilteredAppointments(
        appointments.filter(
          app => app.date < todayStr || ["completed", "cancelled"].includes(app.status)
        )
      );
    } else {
      setFilteredAppointments(appointments);
    }
  }, [selectedTab, appointments]);

  const handleConfirmAppointment = (appointmentId: string) => {
    setConfirmingAppointmentId(appointmentId);
    setIsConfirmationChecked(false);
  };

  const handleConfirmationProceed = () => {
    if (!confirmingAppointmentId) return;
    
    try {
      const updatedAppointment = confirmAppointment(confirmingAppointmentId, userType);
      
      if (updatedAppointment) {
        // Update the appointments state
        setAppointments(prevAppointments => 
          prevAppointments.map(app => 
            app.id === confirmingAppointmentId ? updatedAppointment : app
          )
        );
        
        toast({
          title: "Cita Confirmada",
          description: "Ha confirmado la cita con éxito",
        });
        
        // If it's a patient, proceed to payment
        if (userType === "patient") {
          setSelectedAppointmentId(confirmingAppointmentId);
          setIsPaymentModalOpen(true);
        }
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

  const handleProcessPayment = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Reload the appointments after successful payment
    const currentUser = getCurrentUser();
    if (currentUser) {
      const userAppointments = getUserAppointments(currentUser.id, currentUser.userType);
      setAppointments(userAppointments);
    }
  };

  const handleMarkArrival = (appointmentId: string, minutesLate: number) => {
    try {
      markArrival(appointmentId, userType, minutesLate);
      
      toast({
        title: "Llegada Registrada",
        description: `Se ha registrado su llegada ${minutesLate > 15 ? "tarde" : "a tiempo"} (${minutesLate} minutos).`,
      });
      
      // In a real app, this would trigger penalties or refunds if applicable
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al registrar su llegada",
        variant: "destructive",
      });
    }
  };

  const getCreateAppointmentButton = () => {
    if (userType === "doctor") {
      return (
        <Button onClick={() => navigate("/book-appointment/new")}>
          Crear Cita
        </Button>
      );
    } else {
      return (
        <Button onClick={() => navigate("/doctors")}>
          Solicitar Cita
        </Button>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Citas</h1>
            <p className="text-gray-600 mt-2">
              Administre sus citas programadas
            </p>
          </div>
          {getCreateAppointmentButton()}
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="past">Pasadas</TabsTrigger>
            <TabsTrigger value="all">Todas</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab}>
            {filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                  <CalendarX className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No se encontraron citas</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-sm">
                    {selectedTab === "upcoming" 
                      ? "No tiene citas próximas. ¿Le gustaría reservar una?" 
                      : "No tiene citas pasadas."}
                  </p>
                  {selectedTab === "upcoming" && (
                    <div className="mt-4">
                      {getCreateAppointmentButton()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    userType={userType}
                    onConfirm={handleConfirmAppointment}
                    onProcessPayment={handleProcessPayment}
                    onMarkArrival={handleMarkArrival}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        appointmentId={selectedAppointmentId}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Confirmation Dialog */}
      <Dialog open={confirmingAppointmentId !== null} onOpenChange={() => setConfirmingAppointmentId(null)}>
        <DialogContent>
          <DialogTitle>Confirmar Cita</DialogTitle>
          <DialogDescription>
            {userType === "patient" 
              ? "Al confirmar esta cita, usted acepta las siguientes condiciones:"
              : "Al confirmar esta cita, usted está aceptando la siguiente condición:"}
          </DialogDescription>
          
          <div className="flex items-start space-x-2 mt-4">
            <Checkbox 
              id="confirmation-checkbox" 
              checked={isConfirmationChecked}
              onCheckedChange={() => setIsConfirmationChecked(!isConfirmationChecked)}
              className="mt-1"
            />
            <label htmlFor="confirmation-checkbox" className="text-sm">
              {userType === "patient"
                ? "Entiendo que debo pagar por la cita y que si no asisto, no recibiré un reembolso. Si no confirmo la cita 12 horas antes, esta será cancelada automáticamente."
                : "Entiendo que si llego más de 15 minutos tarde a esta cita, debo ofrecerla sin costo para el paciente. Estoy de acuerdo con esta política."}
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
              {userType === "patient" ? "Confirmar y Proceder al Pago" : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsPage;
