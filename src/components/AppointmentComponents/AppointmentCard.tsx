
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";
import { Appointment } from "@/types";
import { format } from "date-fns";

interface AppointmentCardProps {
  appointment: Appointment;
  userType: "patient" | "doctor";
  onConfirm?: (id: string) => void;
  onProcessPayment?: (id: string) => void;
  onMarkArrival?: (id: string, minutes: number) => void;
}

const AppointmentCard = ({
  appointment,
  userType,
  onConfirm,
  onProcessPayment,
  onMarkArrival,
}: AppointmentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "refunded":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMMM d, yyyy");
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <Card className="overflow-hidden border-l-4 transition-all hover:shadow-md" 
      style={{ borderLeftColor: appointment.status === "confirmed" ? "#10b981" : "#f59e0b" }}>
      <CardHeader className="bg-gray-50 pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">
            {appointment.specialtyName} Appointment
          </CardTitle>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(appointment.date)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Date</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {appointment.startTime} - {appointment.endTime}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Time</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {userType === "patient" ? appointment.doctorName : appointment.patientName}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {userType === "patient" ? "Doctor" : "Patient"}
              </p>
            </div>
          </div>
          
          <div className="pt-2 flex flex-wrap gap-2">
            {/* Payment Status Badge */}
            <Badge variant="outline" className={getPaymentStatusColor(appointment.paymentStatus)}>
              Payment: {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
            </Badge>
            
            {/* Confirmation Status Badges */}
            {appointment.patientConfirmed ? (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Patient Confirmed
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                Patient Not Confirmed
              </Badge>
            )}
            
            {appointment.doctorConfirmed ? (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Doctor Confirmed
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                Doctor Not Confirmed
              </Badge>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="pt-3 flex flex-wrap gap-2">
            {/* Confirm Button - Show only if not confirmed by current user type */}
            {(userType === "patient" && !appointment.patientConfirmed || 
              userType === "doctor" && !appointment.doctorConfirmed) && 
              appointment.status !== "cancelled" && (
              <Button size="sm" onClick={() => onConfirm?.(appointment.id)}>
                Confirm Appointment
              </Button>
            )}
            
            {/* Payment Button - For patients with pending payment */}
            {userType === "patient" && 
              appointment.status === "confirmed" && 
              appointment.paymentStatus === "pending" && (
              <Button size="sm" variant="outline" onClick={() => onProcessPayment?.(appointment.id)}>
                Pay Now
              </Button>
            )}
            
            {/* Mark Arrival (Demo for Late/No-show) */}
            {appointment.status === "confirmed" && appointment.paymentStatus === "paid" && (
              <Button size="sm" variant="outline" onClick={() => onMarkArrival?.(appointment.id, Math.floor(Math.random() * 30))}>
                Mark {userType === "patient" ? "My" : "Patient"} Arrival
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
