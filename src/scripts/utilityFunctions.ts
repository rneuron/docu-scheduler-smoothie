
import { supabase } from "@/integrations/supabase/client";

// This function can be called from the browser console
export async function createDemoDoctors() {
  // Define doctors to create
  const doctorsToCreate = [
    {
      name: "Dra. Laura Martínez",
      email: "laura.martinez@ejemplo.com",
      specialty: "Cardiología",
      location: "Madrid, España",
    },
    {
      name: "Dr. Carlos Ruiz",
      email: "carlos.ruiz@ejemplo.com",
      specialty: "Dermatología",
      location: "Barcelona, España",
    },
    {
      name: "Dra. María López",
      email: "maria.lopez@ejemplo.com",
      specialty: "Neurología",
      location: "Valencia, España",
    },
    {
      name: "Dr. Antonio García",
      email: "antonio.garcia@ejemplo.com",
      specialty: "Traumatología",
      location: "Sevilla, España",
    },
    {
      name: "Dra. Ana Rodríguez",
      email: "ana.rodriguez@ejemplo.com",
      specialty: "Pediatría",
      location: "Bilbao, España",
    }
  ];
  
  let createdCount = 0;

  console.log(`Starting to create ${doctorsToCreate.length} demo doctors...`);
  
  for (const doctor of doctorsToCreate) {
    try {
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email: doctor.email,
        password: "password123",
        options: {
          data: {
            full_name: doctor.name,
            user_type: "doctor",
          }
        }
      });

      if (error) {
        console.error(`Failed to create user for ${doctor.email}:`, error.message);
        continue;
      }

      if (!data.user) {
        console.error(`No user created for ${doctor.email}`);
        continue;
      }

      // Then create the doctor profile
      const doctorData = {
        id: data.user.id,
        full_name: doctor.name,
        specialty: doctor.specialty,
        location: doctor.location,
      };

      const { error: profileError } = await supabase
        .from('doctors')
        .insert(doctorData);

      if (profileError) {
        console.error(`Failed to create doctor profile for ${doctor.email}:`, profileError.message);
        continue;
      }

      console.log(`Successfully created doctor: ${doctor.email}`);
      createdCount++;
    } catch (error) {
      console.error(`Error creating doctor ${doctor.email}:`, error);
    }
  }

  console.log(`Demo doctor creation process completed! Created ${createdCount} out of ${doctorsToCreate.length} doctors.`);
  return createdCount;
}

// Add a function to verify which doctors exist in Supabase
export async function verifyDemoDoctors() {
  // Same doctor emails as in createDemoDoctors
  const doctorEmails = [
    "laura.martinez@ejemplo.com",
    "carlos.ruiz@ejemplo.com", 
    "maria.lopez@ejemplo.com",
    "antonio.garcia@ejemplo.com",
    "ana.rodriguez@ejemplo.com"
  ];
  
  const results = [];

  console.log("Checking which demo doctors exist in Supabase...");
  
  for (const email of doctorEmails) {
    try {
      // Try to sign in with the doctor's credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: "password123",
      });

      if (error) {
        results.push({ email: email, exists: false, error: error.message });
      } else {
        results.push({ email: email, exists: true });
      }
      
      // Sign out after attempting login
      await supabase.auth.signOut();
      
    } catch (error) {
      results.push({ email: email, exists: false, error: "Unknown error" });
    }
  }
  
  // Log detailed results
  console.table(results);
  
  // Summary
  const existingCount = results.filter(r => r.exists).length;
  console.log(`Found ${existingCount} out of ${doctorEmails.length} doctors in Supabase.`);
  
  return results;
}

// List all doctors from Supabase
export async function listAllDoctors() {
  console.log("Fetching all doctors from Supabase...");
  
  const { data, error } = await supabase
    .from('doctors')
    .select('*');
    
  if (error) {
    console.error("Error fetching doctors:", error.message);
    return [];
  }
  
  console.log(`Found ${data.length} doctors in the database:`);
  console.table(data);
  
  return data;
}

// Make functions globally available
if (typeof window !== 'undefined') {
  // Explicitly assign to window object
  window.createDemoDoctors = createDemoDoctors;
  window.verifyDemoDoctors = verifyDemoDoctors;
  window.listAllDoctors = listAllDoctors;
}
