
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import AppointmentCard from "@/components/AppointmentComponents/AppointmentCard";
import { Appointment } from "@/types";
import { CheckCircle } from "lucide-react";

interface PendingAppointmentsSectionProps {
  pendingAppointments: Appointment[];
  onConfirm: (appointmentId: string) => void;
  onMarkArrival: (appointmentId: string, minutesLate: number) => void;
}

const PendingAppointmentsSection = ({ 
  pendingAppointments, 
  onConfirm, 
  onMarkArrival 
}: PendingAppointmentsSectionProps) => {
  const navigate = useNavigate();

  return (
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
              onConfirm={onConfirm}
              onMarkArrival={onMarkArrival}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingAppointmentsSection;
