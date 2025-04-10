
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock } from "lucide-react";

interface DoctorStatsProps {
  totalAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
}

const DoctorStats = ({ totalAppointments, confirmedAppointments, pendingAppointments }: DoctorStatsProps) => {
  return (
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
          <div className="text-2xl font-bold">{pendingAppointments}</div>
          <p className="text-xs text-muted-foreground">
            Esperando confirmación
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorStats;
