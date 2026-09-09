import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

// DOCTOR DASHBOARD
// - View incoming appointment schedule (POST protected GET /api/appointments)
// - Update appointment status (confirm / complete / cancel)
// - Initiate video calls via the Video Room route
export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

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

  const updateStatus = async (id, status) => {
    setMsg('');
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      setMsg(`Appointment ${status}`);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    }
  };

  const startCall = (appt) => {
    navigate(`/room/${appt.roomId}`);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 20 }}>
          <h1 style={{ margin: '0 0 8px 0' }}>Doctor Dashboard</h1>
          <p className="muted">Welcome Dr. {user.name}. Manage your patient consultations below.</p>
        </div>

        {msg && <div className="success-text">{msg}</div>}

        {/* Quick Action Cards */}
        <div className="grid" style={{ marginBottom: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <h3>🤖 AI Assistant</h3>
            <p className="muted">Medical info & medications</p>
            <button className="btn" onClick={() => navigate('/ai-assistant')} style={{ width: '100%' }}>
              Open AI
            </button>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <h3>🏥 Find Doctors</h3>
            <p className="muted">Nearby clinics & facilities</p>
            <button className="btn secondary" onClick={() => navigate('/find-doctors')} style={{ width: '100%' }}>
              Browse Map
            </button>
          </div>
        </div>

        <h2 className="section-title">Incoming Appointments</h2>
        {loading ? (
          <p>Loading...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments scheduled yet.</p>
        ) : (
          <div className="grid">
            {appointments.map((appt) => (
              <div className="card" key={appt._id}>
                <h3>{appt.patientName}</h3>
                <span className="badge">{appt.specialty}</span>
                <p className="muted" style={{ marginTop: 8 }}>
                  📅 {appt.date} • 🕒 {appt.time}
                </p>
                {appt.reason && <p className="muted">Reason: {appt.reason}</p>}
                <p>
                  Status:{' '}
                  <span className={`badge ${appt.status === 'confirmed' ? 'success' : appt.status === 'cancelled' ? 'danger' : 'warning'}`}>
                    {appt.status}
                  </span>
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {appt.status === 'pending' && (
                    <button className="btn" onClick={() => updateStatus(appt._id, 'confirmed')}>
                      Confirm
                    </button>
                  )}
                  {appt.status === 'confirmed' && (
                    <button className="btn success" onClick={() => updateStatus(appt._id, 'completed')}>
                      Complete
                    </button>
                  )}
                  {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                    <button className="btn danger" onClick={() => updateStatus(appt._id, 'cancelled')}>
                      Cancel
                    </button>
                  )}
                  <button className="btn secondary" onClick={() => startCall(appt)}>
                    🎥 Video Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
