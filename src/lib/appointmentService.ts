
import { Appointment, TimeSlot, Doctor } from "@/types";
import { mockAppointments, mockTimeSlots, mockDoctors } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

// Mock database
let appointments = [...mockAppointments];
let timeSlots = [...mockTimeSlots];
let doctors = [...mockDoctors];

// Get available time slots for a specific doctor
export const getAvailableTimeSlots = (doctorId: string): TimeSlot[] => {
  return timeSlots.filter(slot => slot.doctorId === doctorId && !slot.isBooked);
};

// Get doctors by specialty
export const getDoctorsBySpecialty = (specialty: string): Doctor[] => {
  if (!specialty) return doctors;
  return doctors.filter(doctor => doctor.specialty === specialty);
};

// Get all doctors
export const getAllDoctors = (): Doctor[] => {
  return doctors;
};

// Book an appointment
export const bookAppointment = (appointment: Partial<Appointment>): Appointment => {
  // In a real app, this would create an appointment in the database
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
  
  // Update the time slot to be booked
  timeSlots = timeSlots.map(slot => 
    slot.id === newAppointment.timeSlotId ? { ...slot, isBooked: true } : slot
  );
  
  // Add the appointment to the mock database
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
  
  // If both confirmed, update status
  if (appointment.patientConfirmed && appointment.doctorConfirmed) {
    appointment.status = 'confirmed';
  }
  
  // Update in the mock database
  appointments[appointmentIndex] = appointment;
  
  return appointment;
};

// Process payment
export const processPayment = async (appointmentId: string): Promise<boolean> => {
  // In a real app, this would integrate with PayPal API
  // For demo purposes, we'll just simulate a successful payment
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
    
    if (appointmentIndex === -1) return false;
    
    // Update payment status
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      paymentStatus: 'paid'
    };
    
    return true;
  } catch (error) {
    console.error("Payment processing error:", error);
    return false;
  }
};

// Process refund
export const processRefund = async (appointmentId: string): Promise<boolean> => {
  // In a real app, this would integrate with PayPal API
  // For demo purposes, we'll just simulate a successful refund
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
    
    if (appointmentIndex === -1) return false;
    
    // Update payment status
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      paymentStatus: 'refunded'
    };
    
    return true;
  } catch (error) {
    console.error("Refund processing error:", error);
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
  
  // Check if the user is late (more than 15 minutes)
  if (minutesLate > 15) {
    if (userType === 'patient') {
      // Patient is late - automatic penalty
      toast({
        title: "Late Fee Applied",
        description: "A penalty fee has been charged because you arrived more than 15 minutes late.",
        variant: "destructive",
      });
      // In a real app, this would trigger the PayPal API to charge a penalty
    } else {
      // Doctor is late - automatic refund
      toast({
        title: "Appointment Refunded",
        description: "The appointment fee has been refunded because the doctor arrived more than 15 minutes late.",
      });
      // In a real app, this would trigger the PayPal API to process a refund
      await processRefund(appointmentId);
    }
  }
  
  return true;
};
