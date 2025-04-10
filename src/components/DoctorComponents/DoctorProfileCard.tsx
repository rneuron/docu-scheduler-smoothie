
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, User } from "lucide-react";
import { Doctor } from "@/types";

interface DoctorProfileCardProps {
  doctor: Doctor;
  totalPatients: number;
  onEditProfile: () => void;
}

const DoctorProfileCard = ({ doctor, totalPatients, onEditProfile }: DoctorProfileCardProps) => {
  return (
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
            <Button variant="outline" onClick={onEditProfile}>
              Editar Perfil
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorProfileCard;
