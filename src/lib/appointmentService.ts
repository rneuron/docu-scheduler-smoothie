
import { Appointment, TimeSlot, Doctor } from "@/types";
import { mockAppointments, mockTimeSlots, mockDoctors } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

// Mock database
let appointments = [...mockAppointments];
let timeSlots = [...mockTimeSlots];
let doctors = [...mockDoctors];

// Get all doctors - make sure we're returning all doctors in the system
export const getAllDoctors = (): Doctor[] => {
  return doctors;
};

// Get doctors by specialty
export const getDoctorsBySpecialty = (specialty: string): Doctor[] => {
  if (!specialty) return doctors;
  return doctors.filter(doctor => doctor.specialty === specialty);
};

// Get available time slots for a specific doctor
export const getAvailableTimeSlots = (doctorId: string): TimeSlot[] => {
  return timeSlots.filter(slot => slot.doctorId === doctorId && !slot.isBooked);
};

// Add a new doctor to the system
export const addDoctor = (doctor: Omit<Doctor, "id">): Doctor => {
  // Check if this is an update for an existing doctor
  const existingDoctorIndex = doctors.findIndex(d => d.email === doctor.email);
  
  if (existingDoctorIndex !== -1) {
    // Update existing doctor
    const updatedDoctor = {
      ...doctors[existingDoctorIndex],
      ...doctor
    };
    
    doctors[existingDoctorIndex] = updatedDoctor;
    return updatedDoctor;
  } else {
    // Create new doctor
    const newDoctor: Doctor = {
      ...doctor,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    doctors.push(newDoctor);
    return newDoctor;
  }
};

// Book an appointment
export const bookAppointment = (appointment: Partial<Appointment>): Appointment => {
  const newAppointment: Appointment = {
    id: Math.random().toString(36).substr(2, 9),
    patientId: appointment.patientId!,
    doctorId: appointment.doctorId!,
    timeSlotId: appointment.timeSlotId!,
    date: appointment.date!,
    startTime: appointment.startTime!,
    endTime: appointment.endTime!,
    status: "pending",
    patientConfirmed: false,
    doctorConfirmed: false,
    paymentStatus: "pending",
    specialtyName: appointment.specialtyName!,
    doctorName: appointment.doctorName!,
    patientName: appointment.patientName!,
  };
  
  timeSlots = timeSlots.map(slot => 
    slot.id === newAppointment.timeSlotId ? { ...slot, isBooked: true } : slot
  );
  
  appointments.push(newAppointment);
  
  return newAppointment;
};

// Get appointments for a user (either patient or doctor)
export const getUserAppointments = (userId: string, userType: 'patient' | 'doctor'): Appointment[] => {
  if (userType === 'patient') {
    return appointments.filter(appointment => appointment.patientId === userId);
  } else {
    return appointments.filter(appointment => appointment.doctorId === userId);
  }
};

// Confirm appointment
export const confirmAppointment = (appointmentId: string, userType: 'patient' | 'doctor'): Appointment | null => {
  const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
  
  if (appointmentIndex === -1) return null;
  
  const appointment = { ...appointments[appointmentIndex] };
  
  if (userType === 'patient') {
    appointment.patientConfirmed = true;
  } else {
    appointment.doctorConfirmed = true;
  }
  
  if (appointment.patientConfirmed && appointment.doctorConfirmed) {
    appointment.status = 'confirmed';
  }
  
  appointments[appointmentIndex] = appointment;
  
  return appointment;
};

// Process payment
export const processPayment = async (appointmentId: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
    
    if (appointmentIndex === -1) return false;
    
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      paymentStatus: 'paid'
    };
    
    return true;
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    return false;
  }
};

// Process refund
export const processRefund = async (appointmentId: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
    
    if (appointmentIndex === -1) return false;
    
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      paymentStatus: 'refunded'
    };
    
    return true;
  } catch (error) {
    console.error("Error al procesar el reembolso:", error);
    return false;
  }
};

// Mark arrival status (used for late penalty or refund logic)
export const markArrival = async (
  appointmentId: string, 
  userType: 'patient' | 'doctor', 
  minutesLate: number
): Promise<boolean> => {
  const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
  
  if (appointmentIndex === -1) return false;
  
  const appointment = appointments[appointmentIndex];
  
  if (minutesLate > 15) {
    if (userType === 'patient') {
      toast({
        title: "Cargo por Tardanza Aplicado",
        description: "Se ha cobrado una penalización porque llegó más de 15 minutos tarde.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Cita Reembolsada",
        description: "La tarifa de la cita ha sido reembolsada porque el médico llegó más de 15 minutos tarde.",
      });
      await processRefund(appointmentId);
    }
  }
  
  return true;
};
