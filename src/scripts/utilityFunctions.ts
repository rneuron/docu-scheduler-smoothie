
import { supabase } from "@/integrations/supabase/client";
import { users } from "@/data/mockData";

// This function can be called from the browser console
export async function createDemoDoctors() {
  // Filter out doctors from mock data
  const doctorUsers = users.filter(user => user.userType === "doctor");
  let createdCount = 0;

  console.log(`Starting to create ${doctorUsers.length} demo doctors...`);
  
  for (const doctor of doctorUsers) {
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
        specialty: (doctor as any).specialty || "Medicina General",
        location: (doctor as any).location || "Ciudad de México",
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

  console.log(`Demo doctor creation process completed! Created ${createdCount} out of ${doctorUsers.length} doctors.`);
  return createdCount;
}

// Also add a verify function to check which doctors already exist
export async function verifyDemoDoctors() {
  const doctorUsers = users.filter(user => user.userType === "doctor");
  const results = [];

  console.log("Checking which demo doctors exist...");
  
  for (const doctor of doctorUsers) {
    try {
      // Try to sign in with the doctor's credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: doctor.email,
        password: "password123",
      });

      if (error) {
        results.push({ email: doctor.email, exists: false, error: error.message });
      } else {
        results.push({ email: doctor.email, exists: true });
      }
      
      // Sign out after attempting login
      await supabase.auth.signOut();
      
    } catch (error) {
      results.push({ email: doctor.email, exists: false, error: "Unknown error" });
    }
  }
  
  // Log detailed results
  console.table(results);
  
  // Summary
  const existingCount = results.filter(r => r.exists).length;
  console.log(`Found ${existingCount} out of ${doctorUsers.length} doctors in the system.`);
  
  return results;
}

// Make functions globally available
if (typeof window !== 'undefined') {
  // Explicitly assign to window object
  window.createDemoDoctors = createDemoDoctors;
  window.verifyDemoDoctors = verifyDemoDoctors;
}
