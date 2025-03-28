
import { Doctor, Patient, TimeSlot, Appointment, Specialty } from "@/types";

export const specialties: Specialty[] = [
  { id: "1", name: "Cardiology" },
  { id: "2", name: "Dermatology" },
  { id: "3", name: "Neurology" },
  { id: "4", name: "Orthopedics" },
  { id: "5", name: "Pediatrics" },
  { id: "6", name: "Psychiatry" },
  { id: "7", name: "Ophthalmology" },
  { id: "8", name: "Gynecology" },
];

export const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Jane Smith",
    email: "jane.smith@example.com",
    userType: "doctor",
    specialty: "Cardiology",
    location: "New York, NY",
    profileImage: "https://randomuser.me/api/portraits/women/21.jpg",
    bio: "Experienced cardiologist specializing in heart disease prevention.",
  },
  {
    id: "2",
    name: "Dr. John Davis",
    email: "john.davis@example.com",
    userType: "doctor",
    specialty: "Dermatology",
    location: "Los Angeles, CA",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Board-certified dermatologist with expertise in skin cancer screening.",
  },
  {
    id: "3",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    userType: "doctor",
    specialty: "Neurology",
    location: "Chicago, IL",
    profileImage: "https://randomuser.me/api/portraits/women/45.jpg",
    bio: "Neurologist focused on migraines and movement disorders.",
  },
  {
    id: "4",
    name: "Dr. Michael Chen",
    email: "michael.chen@example.com",
    userType: "doctor",
    specialty: "Orthopedics",
    location: "Boston, MA",
    profileImage: "https://randomuser.me/api/portraits/men/52.jpg",
    bio: "Orthopedic surgeon specializing in sports injuries and joint replacements.",
  },
];

export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Alex Thompson",
    email: "alex@example.com",
    userType: "patient",
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    email: "maria@example.com",
    userType: "patient",
  },
];

// Generate time slots for next 7 days
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const now = new Date();
  
  for (let d = 1; d <= 7; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    
    // For each doctor
    mockDoctors.forEach(doctor => {
      // Morning slots
      for (let hour = 9; hour < 12; hour++) {
        slots.push({
          id: `${doctor.id}-${dateStr}-${hour}`,
          doctorId: doctor.id,
          date: dateStr,
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
          isBooked: Math.random() > 0.7, // randomly mark some as booked
        });
      }
      
      // Afternoon slots
      for (let hour = 13; hour < 17; hour++) {
        slots.push({
          id: `${doctor.id}-${dateStr}-${hour}`,
          doctorId: doctor.id,
          date: dateStr,
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
          isBooked: Math.random() > 0.7, // randomly mark some as booked
        });
      }
    });
  }
  
  return slots;
};

export const mockTimeSlots = generateTimeSlots();

// Sample appointments
export const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    doctorId: "1",
    timeSlotId: mockTimeSlots[0].id,
    date: mockTimeSlots[0].date,
    startTime: mockTimeSlots[0].startTime,
    endTime: mockTimeSlots[0].endTime,
    status: "confirmed",
    patientConfirmed: true,
    doctorConfirmed: true,
    paymentStatus: "paid",
    specialtyName: "Cardiology",
    doctorName: "Dr. Jane Smith",
    patientName: "Alex Thompson",
  },
  {
    id: "2",
    patientId: "2",
    doctorId: "2",
    timeSlotId: mockTimeSlots[10].id,
    date: mockTimeSlots[10].date,
    startTime: mockTimeSlots[10].startTime,
    endTime: mockTimeSlots[10].endTime,
    status: "pending",
    patientConfirmed: false,
    doctorConfirmed: true,
    paymentStatus: "pending",
    specialtyName: "Dermatology",
    doctorName: "Dr. John Davis",
    patientName: "Maria Rodriguez",
  },
];

// Let's create a user store with both doctors and patients
export const users = [...mockDoctors, ...mockPatients];
