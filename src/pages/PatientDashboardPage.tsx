
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/Layout/AppHeader";
import AppointmentCard from "@/components/AppointmentComponents/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, isPatient } from "@/lib/auth";
import { getUserAppointments, confirmAppointment } from "@/lib/appointmentService";
import { useToast } from "@/components/ui/use-toast";
import { Appointment } from "@/types";
import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";

const PatientDashboardPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    
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
  }, [navigate, toast]);

  const upcomingAppointments = appointments.filter(
    app => app.status === "confirmed" || app.status === "pending"
  ).slice(0, 3);

  const handleConfirmAppointment = (appointmentId: string) => {
    try {
      const updatedAppointment = confirmAppointment(appointmentId, "patient");
      
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

  // Calculate overall stats
  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(app => app.status === "confirmed").length;
  const pendingAppointments = appointments.filter(app => app.status === "pending").length;

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your appointments and healthcare schedule
          </p>
        </div>
        
        {/* Stats Section */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                All time appointments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Ready for your visit
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Upcoming Appointments Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
            <Button variant="outline" onClick={() => navigate("/appointments")}>
              View All
            </Button>
          </div>
          
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-10 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-8 w-8 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No upcoming appointments</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm">
                  You don't have any upcoming appointments. Would you like to book one?
                </p>
                <Button className="mt-4" onClick={() => navigate("/doctors")}>
                  Find a Doctor
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
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate("/doctors")}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-medical-100 p-3 rounded-full mb-4">
                  <Calendar className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="font-medium mb-2">Book Appointment</h3>
                <p className="text-sm text-gray-500">
                  Find a doctor and schedule a new appointment
                </p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate("/appointments")}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-medical-100 p-3 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="font-medium mb-2">Manage Appointments</h3>
                <p className="text-sm text-gray-500">
                  View, confirm, or cancel your existing appointments
                </p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-medical-100 p-3 rounded-full mb-4">
                  <CheckCircle className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="font-medium mb-2">Health Records</h3>
                <p className="text-sm text-gray-500">
                  Access your medical history and records
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboardPage;
