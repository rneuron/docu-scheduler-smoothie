
import { User, Doctor, Patient } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Sign in with email and password
export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error logging in:', error.message);
      return null;
    }

    if (!data.user) return null;

    // Check if the user is a doctor or patient
    const { data: doctorData } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (doctorData) {
      const userData: Doctor = {
        id: data.user.id,
        name: doctorData.full_name,
        email: data.user.email || '',
        userType: 'doctor',
        specialty: doctorData.specialty,
        location: doctorData.location,
        profileImage: doctorData.profile_image,
      };
      return userData;
    } else {
      // If not a doctor, assume it's a patient
      const userData: Patient = {
        id: data.user.id,
        name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || '',
        email: data.user.email || '',
        userType: 'patient',
      };
      return userData;
    }
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  localStorage.removeItem("currentUser"); // Clean up any existing local storage
};

export const getCurrentUser = async (): Promise<User | null> => {
  // First check if we have a session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  // Then get the user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Check if the user is a doctor
  const { data: doctorData } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (doctorData) {
    const userData: Doctor = {
      id: user.id,
      name: doctorData.full_name,
      email: user.email || '',
      userType: 'doctor',
      specialty: doctorData.specialty,
      location: doctorData.location,
      profileImage: doctorData.profile_image,
    };
    return userData;
  } else {
    // If not a doctor, assume it's a patient
    const userData: Patient = {
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      email: user.email || '',
      userType: 'patient',
    };
    return userData;
  }
};

export const isDoctor = (user?: User | null): user is Doctor => {
  if (!user) return false;
  return user.userType === "doctor";
};

export const isPatient = (user?: User | null): user is Patient => {
  if (!user) return false;
  return user.userType === "patient";
};

export const register = async (userData: Partial<User>, password: string): Promise<User | null> => {
  try {
    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email || '',
      password: password,
      options: {
        data: {
          full_name: userData.name,
          user_type: userData.userType,
        }
      }
    });

    if (authError || !authData.user) {
      console.error('Error registering user:', authError?.message);
      return null;
    }

    // If it's a doctor, add to the doctors table
    if (userData.userType === 'doctor') {
      const doctorData = {
        id: authData.user.id,
        full_name: userData.name || '',
        specialty: (userData as Partial<Doctor>).specialty || '',
        location: (userData as Partial<Doctor>).location || '',
        profile_image: (userData as Partial<Doctor>).profileImage || null,
      };

      const { error: doctorError } = await supabase
        .from('doctors')
        .insert(doctorData);

      if (doctorError) {
        console.error('Error adding doctor profile:', doctorError.message);
        // You may want to delete the auth user if this fails
        return null;
      }

      const newDoctor: Doctor = {
        id: authData.user.id,
        name: userData.name || '',
        email: userData.email || '',
        userType: 'doctor',
        specialty: (userData as Partial<Doctor>).specialty || '',
        location: (userData as Partial<Doctor>).location || '',
        profileImage: (userData as Partial<Doctor>).profileImage,
      };

      return newDoctor;
    } else {
      // Return patient data
      const newPatient: Patient = {
        id: authData.user.id,
        name: userData.name || '',
        email: userData.email || '',
        userType: 'patient',
      };

      return newPatient;
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return null;
  }
};
