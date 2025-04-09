
import { Doctor, Patient, TimeSlot, Appointment, Specialty } from "@/types";

export const specialties: Specialty[] = [
  { id: "1", name: "Cardiología" },
  { id: "2", name: "Dermatología" },
  { id: "3", name: "Neurología" },
  { id: "4", name: "Traumatología" },
  { id: "5", name: "Pediatría" },
  { id: "6", name: "Psiquiatría" },
  { id: "7", name: "Oftalmología" },
  { id: "8", name: "Ginecología" },
];

export const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dra. Laura Martínez",
    email: "laura.martinez@ejemplo.com",
    userType: "doctor",
    specialty: "Cardiología",
    location: "Madrid, España",
    profileImage: "https://randomuser.me/api/portraits/women/21.jpg",
    bio: "Cardióloga especializada en prevención de enfermedades cardíacas con más de 15 años de experiencia.",
  },
  {
    id: "2",
    name: "Dr. Carlos Ruiz",
    email: "carlos.ruiz@ejemplo.com",
    userType: "doctor",
    specialty: "Dermatología",
    location: "Barcelona, España",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Dermatólogo certificado con experiencia en tratamientos para el cáncer de piel y problemas cutáneos complejos.",
  },
  {
    id: "3",
    name: "Dra. María López",
    email: "maria.lopez@ejemplo.com",
    userType: "doctor",
    specialty: "Neurología",
    location: "Valencia, España",
    profileImage: "https://randomuser.me/api/portraits/women/45.jpg",
    bio: "Neuróloga especializada en migrañas y trastornos del movimiento. Amplia experiencia en enfermedades neurodegenerativas.",
  },
  {
    id: "4",
    name: "Dr. Antonio García",
    email: "antonio.garcia@ejemplo.com",
    userType: "doctor",
    specialty: "Traumatología",
    location: "Sevilla, España",
    profileImage: "https://randomuser.me/api/portraits/men/52.jpg",
    bio: "Cirujano ortopédico especializado en lesiones deportivas y reemplazos articulares. Pionero en técnicas mínimamente invasivas.",
  },
  {
    id: "5",
    name: "Dra. Ana Rodríguez",
    email: "ana.rodriguez@ejemplo.com",
    userType: "doctor",
    specialty: "Pediatría",
    location: "Bilbao, España",
    profileImage: "https://randomuser.me/api/portraits/women/28.jpg",
    bio: "Pediatra con 20 años de experiencia en atención infantil. Especialista en desarrollo infantil y enfermedades respiratorias.",
  },
  {
    id: "6",
    name: "Dr. Francisco Torres",
    email: "francisco.torres@ejemplo.com",
    userType: "doctor",
    specialty: "Psiquiatría",
    location: "Zaragoza, España",
    profileImage: "https://randomuser.me/api/portraits/men/41.jpg",
    bio: "Psiquiatra con enfoque en trastornos de ansiedad y depresión. Experiencia en terapias cognitivo-conductuales avanzadas.",
  },
  {
    id: "7",
    name: "Dra. Elena Navarro",
    email: "elena.navarro@ejemplo.com",
    userType: "doctor",
    specialty: "Oftalmología",
    location: "Málaga, España",
    profileImage: "https://randomuser.me/api/portraits/women/67.jpg",
    bio: "Oftalmóloga especializada en cirugía láser y tratamientos para la degeneración macular. Pionera en nuevas técnicas quirúrgicas.",
  },
  {
    id: "8",
    name: "Dr. Miguel Hernández",
    email: "miguel.hernandez@ejemplo.com",
    userType: "doctor",
    specialty: "Ginecología",
    location: "Murcia, España",
    profileImage: "https://randomuser.me/api/portraits/men/61.jpg",
    bio: "Ginecólogo con amplia experiencia en salud reproductiva. Especialista en tratamientos de fertilidad y embarazos de alto riesgo.",
  },
  {
    id: "9",
    name: "Dra. Lucía Moreno",
    email: "lucia.moreno@ejemplo.com",
    userType: "doctor",
    specialty: "Cardiología",
    location: "Alicante, España",
    profileImage: "https://randomuser.me/api/portraits/women/82.jpg",
    bio: "Cardióloga intervencionista especializada en procedimientos mínimamente invasivos. Experiencia en cardiopatías congénitas.",
  },
  {
    id: "10",
    name: "Dr. Javier Sánchez",
    email: "javier.sanchez@ejemplo.com",
    userType: "doctor",
    specialty: "Dermatología",
    location: "Granada, España",
    profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
    bio: "Dermatólogo estético con amplia formación en tratamientos anti-envejecimiento y problemas cutáneos crónicos.",
  },
  {
    id: "11",
    name: "Dra. Patricia Díaz",
    email: "patricia.diaz@ejemplo.com",
    userType: "doctor",
    specialty: "Neurología",
    location: "Valladolid, España",
    profileImage: "https://randomuser.me/api/portraits/women/37.jpg",
    bio: "Neuróloga especializada en trastornos del sueño y epilepsia. Investigadora activa en nuevos tratamientos neurológicos.",
  },
  {
    id: "12",
    name: "Dr. Alberto Jiménez",
    email: "alberto.jimenez@ejemplo.com",
    userType: "doctor",
    specialty: "Traumatología",
    location: "Córdoba, España",
    profileImage: "https://randomuser.me/api/portraits/men/22.jpg",
    bio: "Traumatólogo especializado en medicina deportiva y lesiones de rodilla. Consultor para equipos deportivos profesionales.",
  },
];

export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Alex Torres",
    email: "alex@ejemplo.com",
    userType: "patient",
  },
  {
    id: "2",
    name: "María Rodríguez",
    email: "maria@ejemplo.com",
    userType: "patient",
  },
];

// Generar horarios disponibles para los próximos 7 días
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const now = new Date();
  
  for (let d = 1; d <= 7; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    
    // Para cada médico
    mockDoctors.forEach(doctor => {
      // Horarios de mañana
      for (let hour = 9; hour < 12; hour++) {
        slots.push({
          id: `${doctor.id}-${dateStr}-${hour}`,
          doctorId: doctor.id,
          date: dateStr,
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
          isBooked: Math.random() > 0.7, // marcar algunos como reservados aleatoriamente
        });
      }
      
      // Horarios de tarde
      for (let hour = 13; hour < 17; hour++) {
        slots.push({
          id: `${doctor.id}-${dateStr}-${hour}`,
          doctorId: doctor.id,
          date: dateStr,
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
          isBooked: Math.random() > 0.7, // marcar algunos como reservados aleatoriamente
        });
      }
    });
  }
  
  return slots;
};

export const mockTimeSlots = generateTimeSlots();

// Citas de ejemplo
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
    specialtyName: "Cardiología",
    doctorName: "Dra. Laura Martínez",
    patientName: "Alex Torres",
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
    specialtyName: "Dermatología",
    doctorName: "Dr. Carlos Ruiz",
    patientName: "María Rodríguez",
  },
];

// Almacén de usuarios con médicos y pacientes
export const users = [...mockDoctors, ...mockPatients];
