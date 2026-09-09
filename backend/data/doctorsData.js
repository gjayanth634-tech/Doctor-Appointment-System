// Ready-made mock doctor list.
// These records are served instantly via GET /api/doctors so the patient
// dashboard is fully populated without any database seeding step.
export const doctorsData = [
  {
    id: 'doc-001',
    name: 'Dr. Ayesha Khan',
    specialization: 'Cardiologist',
    hospitalName: 'City Heart Institute',
    experience: 12,
    fee: 800,
    rating: 4.8,
    image: 'https://i.pravatar.cc/150?img=47',
    availableSlots: ['09:00 AM', '10:00 AM', '11:30 AM', '04:00 PM']
  },
  {
    id: 'doc-002',
    name: 'Dr. Rohan Mehta',
    specialization: 'Dermatologist',
    hospitalName: 'Skin & Care Clinic',
    experience: 8,
    fee: 600,
    rating: 4.6,
    image: 'https://i.pravatar.cc/150?img=12',
    availableSlots: ['10:30 AM', '01:00 PM', '03:30 PM']
  },
  {
    id: 'doc-003',
    name: 'Dr. Priya Nair',
    specialization: 'Pediatrician',
    hospitalName: 'Little Angels Hospital',
    experience: 15,
    fee: 500,
    rating: 4.9,
    image: 'https://i.pravatar.cc/150?img=32',
    availableSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '05:00 PM']
  },
  {
    id: 'doc-004',
    name: 'Dr. Arjun Singh',
    specialization: 'Neurologist',
    hospitalName: 'Neuro Care Center',
    experience: 18,
    fee: 1200,
    rating: 4.7,
    image: 'https://i.pravatar.cc/150?img=15',
    availableSlots: ['08:30 AM', '12:00 PM', '04:30 PM']
  },
  {
    id: 'doc-005',
    name: 'Dr. Sneha Reddy',
    specialization: 'Orthopedist',
    hospitalName: 'Bone & Joint Hospital',
    experience: 10,
    fee: 700,
    rating: 4.5,
    image: 'https://i.pravatar.cc/150?img=45',
    availableSlots: ['09:00 AM', '10:00 AM', '01:30 PM', '03:00 PM']
  },
  {
    id: 'doc-006',
    name: 'Dr. Karan Patel',
    specialization: 'General Physician',
    hospitalName: 'Wellness Family Clinic',
    experience: 9,
    fee: 400,
    rating: 4.4,
    image: 'https://i.pravatar.cc/150?img=11',
    availableSlots: ['08:00 AM', '09:15 AM', '11:45 AM', '06:00 PM']
  },
  {
    id: 'doc-007',
    name: 'Dr. Meera Joshi',
    specialization: 'Ophthalmologist',
    hospitalName: 'Vision Plus Eye Care',
    experience: 11,
    fee: 550,
    rating: 4.6,
    image: 'https://i.pravatar.cc/150?img=20',
    availableSlots: ['10:00 AM', '12:30 PM', '02:30 PM', '05:30 PM']
  },
  {
    id: 'doc-008',
    name: 'Dr. Imran Shaikh',
    specialization: 'Dentist',
    hospitalName: 'Smile Dental Studio',
    experience: 7,
    fee: 450,
    rating: 4.3,
    image: 'https://i.pravatar.cc/150?img=51',
    availableSlots: ['09:45 AM', '11:15 AM', '01:00 PM', '04:15 PM']
  }
];
