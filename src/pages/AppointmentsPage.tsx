
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/Layout/AppHeader";
import AppointmentCard from "@/components/AppointmentComponents/AppointmentCard";
import PaymentModal from "@/components/AppointmentComponents/PaymentModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to view your appointments",
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
    try {
      const updatedAppointment = confirmAppointment(appointmentId, userType);
      
      if (updatedAppointment) {
        // Update the appointments state
        setAppointments(prevAppointments => 
          prevAppointments.map(app => 
            app.id === appointmentId ? updatedAppointment : app
          )
        );
        
        toast({
          title: "Appointment Confirmed",
          description: "You have successfully confirmed the appointment",
        });
      }
    } catch (error) {
      toast({
        title: "Confirmation Failed",
        description: "There was an error confirming the appointment",
        variant: "destructive",
      });
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
        title: "Arrival Marked",
        description: `You've been marked as ${minutesLate > 15 ? "late" : "on time"} (${minutesLate} minutes).`,
      });
      
      // In a real app, this would trigger penalties or refunds if applicable
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error marking your arrival",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-2">
            Manage your scheduled appointments
          </p>
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab}>
            {filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                  <CalendarX className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-sm">
                    {selectedTab === "upcoming" 
                      ? "You don't have any upcoming appointments. Would you like to book one?" 
                      : "You don't have any past appointments."}
                  </p>
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
      
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        appointmentId={selectedAppointmentId}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default AppointmentsPage;
