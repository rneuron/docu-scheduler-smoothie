
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { specialties } from "@/data/mockData";
import { getAllDoctors, getDoctorsBySpecialty } from "@/lib/appointmentService";
import DoctorCard from "./DoctorCard";
import { Doctor } from "@/types";
import { Search } from "lucide-react";

const DoctorDirectory = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    // Load all doctors initially
    const allDoctors = getAllDoctors();
    setDoctors(allDoctors);
    setFilteredDoctors(allDoctors);
  }, []);
  
  useEffect(() => {
    // Apply filters when specialty or search query changes
    let results = doctors;
    
    if (selectedSpecialty && selectedSpecialty !== "all") {
      results = getDoctorsBySpecialty(selectedSpecialty);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        doctor => 
          doctor.name.toLowerCase().includes(query) || 
          doctor.specialty.toLowerCase().includes(query) ||
          doctor.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredDoctors(results);
  }, [selectedSpecialty, searchQuery, doctors]);
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="specialty">Especialidad</Label>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger id="specialty">
              <SelectValue placeholder="Todas las Especialidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Especialidades</SelectItem>
              {specialties.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.name}>
                  {specialty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="search"
              placeholder="Buscar por nombre, especialidad o ubicación"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No se encontraron médicos</h3>
          <p className="mt-2 text-sm text-gray-500">
            Intente ajustar su búsqueda o filtro para encontrar lo que está buscando.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDirectory;
