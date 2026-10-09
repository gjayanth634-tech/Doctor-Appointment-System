# Doctor Appointment System

A full-stack telehealth and doctor appointment platform built with React + Vite on the frontend and Express + MongoDB on the backend. The application supports patient, doctor, and admin workflows, AI-powered symptom guidance, appointment booking, teleconsultation rooms, doctor discovery/search, and healthcare information APIs.

## Project overview

This project is designed to simulate a practical healthcare booking application where:

- Patients can register/login and browse doctors
- Doctors can manage their schedule and appointments
- Admins can view users and supervise the system
- Patients can book appointments with a selected doctor
- The app generates a telehealth room for each appointment
- Users can access AI-based symptom and medical guidance
- The system offers doctor location/search and video consultation features

The repository is a split-stack application:

- Frontend: React SPA with routing and role-based access
- Backend: Express REST API with MongoDB models and middleware
- AI features: symptom checker, condition lookup, medication information, and medical chat
- Integration features: video call support and location mapping APIs

## Tech stack

Frontend
- React 18
- Vite
- React Router DOM
- Axios
- CSS-based styling

Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT-based authentication
- CORS
- dotenv for environment variables

Additional capabilities
- Google Maps / location APIs
- Jitsi / Twilio video call support
- Google Gemini AI for medical chat
- Healthcare knowledge data model for conditions and medications

## Application architecture

The repository is organized into two primary folders:

- backend/ — API server, authentication, routes, data, middleware, models
- frontend/ — Vite React app with pages, components, context, and API helpers

### Backend responsibilities

The backend exposes multiple route groups:

- /api/auth — registration, login, session restore, admin user listing
- /api/doctors — doctor data retrieval
- /api/appointments — create, list, update status, cancel appointments
- /api/ai — medical symptom analysis, drug interaction checking, condition data, treatment plans, AI chat
- /api/location — geocoding, nearby doctors, place details, directions
- /api/video-call — meeting session setup and video features

### Frontend responsibilities

The frontend handles user interface flows for:

- Welcome/authentication pages
- Patient dashboard
- Doctor dashboard
- Admin dashboard
- Appointment booking and viewing
- Video consultation room
- Doctor location search
- AI medical assistant

## Core features

### 1. Role-based user system

Users can sign up with roles:

- patient
- doctor
- admin

Authentication is implemented with JWT tokens and protected routes in the frontend.

### 2. Appointment booking workflow

Patients can:

- View doctor cards with specialties, hospital, ratings, and fee
- Select a doctor
- Choose date and time slot
- Submit a reason for the visit
- Receive a generated telehealth room identifier for the consultation

The backend creates appointment records and stores them in MongoDB.

### 3. AI-powered health assistance

The AI route layer includes:

- Symptom checker
- Medication lookup by category and name
- Drug interaction analysis
- Condition information retrieval
- Treatment plan suggestions
- AI medical chat via Gemini

This gives the project a healthcare support layer beyond standard scheduling.

### 4. Video consultation support

The project includes telehealth room support and dedicated video call route integrations, including:

- Jitsi-based video room support
- Twilio-based alternative video provider support
- Session tracking APIs
- Participant and recording-related endpoints

### 5. Location and doctor discovery

The application includes location APIs to support:

- Geocoding addresses
- Reverse geocoding
- Nearby place search
- Distance calculations
- Directions / route info

This gives the platform a real-world healthcare discovery utility.

## Folder structure

```text
Doctor-Appointment-System/
├── backend/
│   ├── data/
│   │   ├── doctorsData.js
│   │   └── medicalKnowledgeBase.js
│   ├── middleware/
│   ├── models/
│   │   ├── Appointment.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── locationRoutes.js
│   │   └── videoCallRoutes.js
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.js
│   │   │   └── locationAndVideoAPI.js
│   │   ├── components/
│   │   │   ├── AIMedicalAssistant.jsx
│   │   │   ├── DoctorLocations.jsx
│   │   │   ├── EnhancedVideoRoom.jsx
│   │   │   ├── JitsiMeet.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AppointmentsPage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   └── VideoRoom.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── API_DOCUMENTATION.md
├── COMPLETION_SUMMARY.md
├── INTEGRATION_SUMMARY.md
├── QUICK_REFERENCE.md
├── SETUP_GUIDE.md
├── .gitignore
└── README.md
```

## Key implementation observations

### Frontend design

The frontend uses a route-based UI structure with:

- BrowserRouter for URL navigation
- ProtectedRoute to enforce authentication
- Role-specific dashboard pages
- Centralized auth state in AuthContext
- API calls performed through a reusable axios instance

This is a clean pattern and makes the app expandable for more healthcare modules.

### Backend design

The backend is organized by route module and domain logic, which is a strong and maintainable structure:

- authRoutes handles identity and credential management
- appointmentRoutes manages scheduling and status workflows
- aiRoutes centralizes medical knowledge and AI access
- locationRoutes and videoCallRoutes add external API integrations

The server entry file loads all route modules and configures the Express application.

### Data model logic

The system uses:

- User model for authentication and role assignment
- Appointment model for schedule records
- doctorsData.js as a mock doctor catalog
- medicalKnowledgeBase.js for conditions, medications, and AI processing helpers

This gives the app a realistic demo environment without requiring a complex production database design.

## How the app works

### User journey: patient

1. User registers or logs in as a patient
2. User lands on the patient dashboard
3. Patient reviews doctor cards and picks a specialist
4. Patient books an appointment selected for a date and time
5. Backend creates appointment record and room ID
6. Patient navigates to video room or dashboard to manage appointments
7. Patient can use AI assistant to check symptoms or ask health questions

### User journey: doctor

1. Doctor logs in to the doctor dashboard
2. Doctor can review booked appointments
3. Doctor can update appointment status
4. Doctor can access consultation room features

### User journey: admin

1. Admin logs in
2. Admin can view system users and manage broader workflows

## Security and production notes

The project has a solid foundation for a demo/portfolio app, but there are a few important points to consider before production use:

- JWT secret should be unique and stored securely in a real deployment environment
- MongoDB connection should point to a managed database in production
- API keys for Gemini, Google Maps, Jitsi/Twilio should be protected from source control
- Input validation should be strengthened for real-world healthcare data
- Medical advice is informational only and should not replace licensed doctor advice

## Setup instructions

### Prerequisites

- Node.js >= 18
- npm
- MongoDB running locally or accessible via a cloud MongoDB service

### 1. Clone the repo

```bash
git clone https://github.com/gjayanth634-tech/Doctor-Appointment-System.git
cd Doctor-Appointment-System
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Then update `.env` with your values, especially:

```env
MONGO_URI=mongodb://localhost:27017/doctor-appointment-system
PORT=5000
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_key_here
GOOGLE_MAPS_API_KEY=your_key_here
JITSI_API_KEY=your_key_here
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
```

Start backend:

```bash
npm start
```

Or use development mode:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend typically runs on:

- http://localhost:5173

Backend typically runs on:

- http://localhost:5000

## Main routes in the app

Frontend routes include:

- /
- /patient
- /doctor
- /admin
- /appointments
- /room/:roomId
- /enhanced-video/:roomId
- /find-doctors
- /ai-assistant

Backend route groups include:

- /api/auth
- /api/doctors
- /api/appointments
- /api/ai
- /api/location
- /api/video-call

## Development assessment

### Strengths

- Clear separation between frontend and backend
- Practical healthcare domain with real workflow logic
- Role-based access structure is implemented cleanly
- Includes AI + telehealth + appointment booking combinations
- Good project documentation already exists in the root
- Useful for portfolio/demo purposes

### Potential improvements

- Add better data validation and error handling for all API paths
- Add real doctor schedule management rather than static seeded data
- Use a proper database schema for doctors, slots, and appointment history
- Add admin workflows and staff management screens
- Add tests for backend and frontend flows
- Add deployment configuration for production hosting
- Add responsive UX refinements

## Summary

This project is a comprehensive healthcare booking and telehealth demo that blends:

- patient management
- doctor discovery
- appointment creation
- AI health assistance
- video consultation support
- maps/location functionality

It is a strong full-stack portfolio project with substantial practical value and clear potential for future expansions into a production healthcare platform.

## Documentation in this repository

The repo already includes several helpful docs:

- API_DOCUMENTATION.md
- SETUP_GUIDE.md
- QUICK_REFERENCE.md
- COMPLETION_SUMMARY.md
- INTEGRATION_SUMMARY.md

This README serves as the primary overview for the project.

## License

No explicit license file was found in the repository. If you intend to publish or share this project publicly, consider adding an appropriate license such as MIT or Apache 2.0.

## Project status

The repository is structured as a working full-stack prototype and demonstrates a realistic telemedicine platform concept ready for further enhancement and production hardening.

