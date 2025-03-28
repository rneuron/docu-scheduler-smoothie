
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Doctor } from "@/types";
import { useNavigate } from "react-router-dom";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-medical-100 to-medical-50 p-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={doctor.profileImage} alt={doctor.name} />
              <AvatarFallback className="bg-medical-200 text-medical-800 text-xl">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h3 className="mt-4 text-xl font-semibold">{doctor.name}</h3>
            <Badge variant="outline" className="mt-2 bg-white">
              {doctor.specialty}
            </Badge>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              {doctor.location}
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 text-sm line-clamp-3">
            {doctor.bio || "Experienced healthcare professional providing quality care to patients."}
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <Button 
          className="w-full" 
          onClick={() => navigate(`/book-appointment/${doctor.id}`)}
        >
          Book Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
