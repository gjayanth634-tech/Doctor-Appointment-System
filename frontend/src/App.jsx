import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthPage from './pages/AuthPage.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import VideoRoom from './pages/VideoRoom.jsx';
import DoctorLocations from './components/DoctorLocations.jsx';
import EnhancedVideoRoom from './components/EnhancedVideoRoom.jsx';
import AIMedicalAssistant from './components/AIMedicalAssistant.jsx';

// If a logged-in user hits "/", send them to their role dashboard.
function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="container">Loading...</div>;
  if (user) return <Navigate to={`/${user.role}`} replace />;
  return <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          <Route
            path="/patient"
            element={
              <ProtectedRoute allow={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allow={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allow={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <VideoRoom />
              </ProtectedRoute>
            }
          />

          <Route
            path="/enhanced-video/:roomId"
            element={
              <ProtectedRoute>
                <EnhancedVideoRoom />
              </ProtectedRoute>
            }
          />

          <Route
            path="/find-doctors"
            element={
              <ProtectedRoute>
                <DoctorLocations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <AIMedicalAssistant />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
