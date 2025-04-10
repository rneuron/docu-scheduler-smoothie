
/* 
  This is a developer utility file to create demo doctor accounts in Supabase.
  Do not use in production. Run this file manually when needed.
  
  How to use:
  1. Import this file directly from a browser console or set up a temporary UI
  2. Call createDemoDoctors() from the console
*/

import { supabase } from "@/integrations/supabase/client";
import { users } from "@/data/mockData";

export async function createDemoDoctors() {
  const doctors = users.filter(user => user.userType === "doctor");
  
  for (const doctor of doctors) {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: doctor.email,
      password: "password123",
      email_confirm: true,
      user_metadata: {
        full_name: doctor.name,
        user_type: "doctor"
      }
    });

    if (authError) {
      console.error(`Error creating auth user for ${doctor.email}:`, authError);
      continue;
    }

    // Then create the doctor profile
    const doctorData = {
      id: authData.user.id,
      full_name: doctor.name,
      specialty: (doctor as any).specialty || '',
      location: (doctor as any).location || '',
      profile_image: (doctor as any).profileImage || null,
    };

    const { error: doctorError } = await supabase
      .from('doctors')
      .insert(doctorData);

    if (doctorError) {
      console.error(`Error creating doctor profile for ${doctor.email}:`, doctorError);
      continue;
    }

    console.log(`Created doctor: ${doctor.email}`);
  }

  console.log("Demo doctor creation complete!");
}

// Alternative: Create a single demo doctor
export async function createDemoDoctor(
  email: string, 
  name: string, 
  specialty: string, 
  location: string,
  profileImage?: string
) {
  // Create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: "password123",
    email_confirm: true,
    user_metadata: {
      full_name: name,
      user_type: "doctor"
    }
  });

  if (authError) {
    console.error(`Error creating auth user for ${email}:`, authError);
    return;
  }

  // Create the doctor profile
  const doctorData = {
    id: authData.user.id,
    full_name: name,
    specialty: specialty,
    location: location,
    profile_image: profileImage || null,
  };

  const { error: doctorError } = await supabase
    .from('doctors')
    .insert(doctorData);

  if (doctorError) {
    console.error(`Error creating doctor profile for ${email}:`, doctorError);
    return;
  }

  console.log(`Created doctor: ${email}`);
  return authData.user;
}
