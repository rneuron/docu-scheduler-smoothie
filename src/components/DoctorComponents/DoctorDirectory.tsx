
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { specialties } from "@/data/mockData";
import { fetchAllDoctors, fetchDoctorsBySpecialty } from "@/lib/doctorService";
import DoctorCard from "./DoctorCard";
import { Doctor } from "@/types";
import { Search } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";

const DoctorDirectory = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const doctorsPerPage = 6;
  
  // Refreshes the doctor list - now using Supabase
  const refreshDoctors = async () => {
    setIsLoading(true);
    try {
      const allDoctors = await fetchAllDoctors();
      console.log("Doctors loaded from Supabase:", allDoctors.length);
      setDoctors(allDoctors);
      
      // Apply current filters to the refreshed list
      if (selectedSpecialty && selectedSpecialty !== "all") {
        const filteredDocs = await fetchDoctorsBySpecialty(selectedSpecialty);
        setFilteredDoctors(filteredDocs);
      } else {
        setFilteredDoctors(allDoctors);
      }
    } catch (error) {
      console.error("Error refreshing doctors:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los médicos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Load all doctors initially
    refreshDoctors();
    
    // Set up polling to refresh the doctor list every 30 seconds
    const intervalId = setInterval(refreshDoctors, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    // Apply filters when specialty changes
    const applySpecialtyFilter = async () => {
      setIsLoading(true);
      try {
        if (selectedSpecialty && selectedSpecialty !== "all") {
          const filteredDocs = await fetchDoctorsBySpecialty(selectedSpecialty);
          setFilteredDoctors(filteredDocs);
        } else {
          setFilteredDoctors(doctors);
        }
      } catch (error) {
        console.error("Error applying specialty filter:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    applySpecialtyFilter();
  }, [selectedSpecialty, doctors]);
  
  // Apply search filter
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const results = filteredDoctors.filter(
        doctor => 
          doctor.name.toLowerCase().includes(query) || 
          doctor.specialty.toLowerCase().includes(query) ||
          doctor.location.toLowerCase().includes(query)
      );
      setFilteredDoctors(results);
    } else if (selectedSpecialty && selectedSpecialty !== "all") {
      // If there's no search but there is a specialty filter, re-apply that filter
      const applySpecialtyFilter = async () => {
        const filteredDocs = await fetchDoctorsBySpecialty(selectedSpecialty);
        setFilteredDoctors(filteredDocs);
      };
      applySpecialtyFilter();
    } else {
      // If no search and no specialty filter, show all doctors
      setFilteredDoctors(doctors);
    }
    
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery]);

  // Get doctors for current page
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  
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
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-gray-700">Cargando médicos...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No se encontraron médicos</h3>
          <p className="mt-2 text-sm text-gray-500">
            Intente ajustar su búsqueda o filtro para encontrar lo que está buscando.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage(prev => prev - 1)} />
                  </PaginationItem>
                )}
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink 
                      isActive={currentPage === index + 1} 
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => setCurrentPage(prev => prev + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default DoctorDirectory;
