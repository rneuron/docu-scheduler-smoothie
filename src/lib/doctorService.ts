
import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "@/types";

// Fetch all doctors from Supabase
export const fetchAllDoctors = async (): Promise<Doctor[]> => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*');
      
    if (error) {
      console.error("Error fetching doctors:", error.message);
      return [];
    }
    
    // Transform the Supabase data to match our Doctor type
    const doctors: Doctor[] = data.map(doc => ({
      id: doc.id,
      name: doc.full_name,
      email: "", // Email is not stored in the doctors table
      userType: "doctor",
      specialty: doc.specialty,
      location: doc.location,
      profileImage: null // There's no profile_image in the database yet
    }));
    
    return doctors;
  } catch (error) {
    console.error("Error in fetchAllDoctors:", error);
    return [];
  }
};

// Fetch doctors by specialty
export const fetchDoctorsBySpecialty = async (specialty: string): Promise<Doctor[]> => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('specialty', specialty);
      
    if (error) {
      console.error(`Error fetching doctors with specialty ${specialty}:`, error.message);
      return [];
    }
    
    // Transform the Supabase data to match our Doctor type
    const doctors: Doctor[] = data.map(doc => ({
      id: doc.id,
      name: doc.full_name,
      email: "", // Email is not stored in the doctors table
      userType: "doctor",
      specialty: doc.specialty,
      location: doc.location,
      profileImage: null // There's no profile_image in the database yet
    }));
    
    return doctors;
  } catch (error) {
    console.error(`Error in fetchDoctorsBySpecialty:`, error);
    return [];
  }
};

// Fetch a single doctor by ID
export const fetchDoctorById = async (doctorId: string): Promise<Doctor | null> => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', doctorId)
      .maybeSingle();
      
    if (error || !data) {
      console.error(`Error fetching doctor with ID ${doctorId}:`, error?.message || "No data returned");
      return null;
    }
    
    // Transform the Supabase data to match our Doctor type
    const doctor: Doctor = {
      id: data.id,
      name: data.full_name,
      email: "", // Email is not stored in the doctors table
      userType: "doctor",
      specialty: data.specialty,
      location: data.location,
      profileImage: null // There's no profile_image in the database yet
    };
    
    return doctor;
  } catch (error) {
    console.error(`Error in fetchDoctorById:`, error);
    return null;
  }
};
