
export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'patient' | 'doctor';
}

export interface Doctor extends User {
  specialty: string;
  location: string;
  profileImage?: string;
  bio?: string;
  userType: 'doctor';
}

export interface Patient extends User {
  userType: 'patient';
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  timeSlotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  patientConfirmed: boolean;
  doctorConfirmed: boolean;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialtyName: string;
  doctorName: string;
  patientName: string;
}

export type Specialty = {
  id: string;
  name: string;
};
