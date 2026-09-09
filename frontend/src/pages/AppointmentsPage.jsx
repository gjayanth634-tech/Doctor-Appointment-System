import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

// Shared appointments view used by patients and doctors at /appointments.
export default function AppointmentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get('/appointments')
      .then((res) => setAppointments(res.data.appointments))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 20 }}>
          <h1 style={{ margin: '0 0 8px 0' }}>My Appointments</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <div className="grid">
            {appointments.map((appt) => (
              <div className="card" key={appt._id}>
                <h3>{user.role === 'patient' ? appt.doctorName : appt.patientName}</h3>
                <span className="badge">{appt.specialty}</span>
                <p className="muted" style={{ marginTop: 8 }}>📅 {appt.date} • 🕒 {appt.time}</p>
                <span className={`badge ${appt.status === 'confirmed' ? 'success' : appt.status === 'cancelled' ? 'danger' : 'warning'}`}>
                  {appt.status}
                </span>
                {appt.roomId && (
                  <div style={{ marginTop: 10 }}>
                    <button className="btn" onClick={() => navigate(`/room/${appt.roomId}`)}>
                      🎥 Join Video Call
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
