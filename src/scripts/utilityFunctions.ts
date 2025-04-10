
import { supabase } from "@/integrations/supabase/client";
import { users } from "@/data/mockData";

// This function can be called from the browser console
export async function createDemoDoctors() {
  // Filter out doctors from mock data
  const doctorUsers = users.filter(user => user.userType === "doctor");
  
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
        profile_image: (doctor as any).profileImage || null,
      };

      const { error: profileError } = await supabase
        .from('doctors')
        .insert(doctorData);

      if (profileError) {
        console.error(`Failed to create doctor profile for ${doctor.email}:`, profileError.message);
        continue;
      }

      console.log(`Successfully created doctor: ${doctor.email}`);
    } catch (error) {
      console.error(`Error creating doctor ${doctor.email}:`, error);
    }
  }

  console.log("Demo doctor creation process completed!");
}

// Export function to be accessible from window
if (typeof window !== 'undefined') {
  (window as any).createDemoDoctors = createDemoDoctors;
}
