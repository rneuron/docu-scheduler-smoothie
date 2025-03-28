
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/Layout/AppHeader";
import AppointmentCard from "@/components/AppointmentComponents/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser, isDoctor } from "@/lib/auth";
import { getUserAppointments, confirmAppointment, markArrival } from "@/lib/appointmentService";
import { useToast } from "@/components/ui/use-toast";
import { Appointment, Doctor } from "@/types";
import { Calendar, CheckCircle, Clock, AlertTriangle, User, MapPin } from "lucide-react";

const DoctorDashboardPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (!currentUser || !isDoctor(currentUser)) {
      toast({
        title: "Access Denied",
        description: "Please log in as a doctor to access this page",
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

  // Filter today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    app => app.date === today && (app.status === "confirmed" || app.status === "pending")
  );

  const pendingAppointments = appointments.filter(
    app => app.status === "pending" && !app.doctorConfirmed
  ).slice(0, 3);

  const handleConfirmAppointment = (appointmentId: string) => {
    try {
      const updatedAppointment = confirmAppointment(appointmentId, "doctor");
      
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

  const handleMarkArrival = (appointmentId: string, minutesLate: number) => {
    try {
      markArrival(appointmentId, "doctor", minutesLate);
      
      toast({
        title: "Patient Arrival Marked",
        description: `Patient has been marked as ${minutesLate > 15 ? "late" : "on time"} (${minutesLate} minutes).`,
      });
      
      // In a real app, this would trigger penalties or refunds if applicable
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error marking patient arrival",
        variant: "destructive",
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
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your schedule and patient appointments
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
                      <span className="text-sm text-gray-600">{totalPatients} Total Patients</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex justify-center">
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
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
                Ready for patient visits
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
              <Clock className="h-4 w-4 text-medical-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Appointments for today
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Pending Appointments Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Pending Confirmations</h2>
            <Button variant="outline" onClick={() => navigate("/appointments")}>
              View All Appointments
            </Button>
          </div>
          
          {pendingAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-10 flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No pending confirmations</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm">
                  You have no appointments that need your confirmation.
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
        
        {/* Today's Schedule Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
          
          {todayAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-10 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No appointments today</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm">
                  You have no scheduled appointments for today.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {todayAppointments.map((appointment) => (
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
      </main>
    </div>
  );
};

export default DoctorDashboardPage;
