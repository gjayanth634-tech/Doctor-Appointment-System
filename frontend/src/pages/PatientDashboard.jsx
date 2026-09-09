import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

// PATIENT DASHBOARD
// - Fetches ready-made doctor list from GET /api/doctors
// - AI Symptom Checker widget (POST /api/ai/symptom-checker)
// - Booking form to reserve a time slot (POST /api/appointments)
export default function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Symptom checker state
  const [symptom, setSymptom] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState('');
  const [aiBusy, setAiBusy] = useState(false);

  // Booking state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [bookMsg, setBookMsg] = useState('');

  useEffect(() => {
    api
      .get('/doctors')
      .then((res) => setDoctors(res.data.doctors))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSymptomCheck = async (e) => {
    e.preventDefault();
    setAiError('');
    setAiResult(null);
    setAiBusy(true);
    try {
      const res = await api.post('/ai/symptom-checker', { symptom });
      setAiResult(res.data);
    } catch (err) {
      setAiError(err.response?.data?.message || 'Check failed');
    } finally {
      setAiBusy(false);
    }
  };

  const openBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setTime('');
    setReason('');
    setBookMsg('');
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookMsg('');
    try {
      const res = await api.post('/appointments', {
        doctorId: selectedDoctor.id,
        date,
        time,
        reason
      });
      setBookMsg(`Booked! Join video call at /room/${res.data.appointment.roomId}`);
      setSelectedDoctor(null);
    } catch (err) {
      setBookMsg(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 20 }}>
          <h1 style={{ margin: '0 0 8px 0' }}>Patient Dashboard</h1>
          <p className="muted">Book a consultation with our specialists or check your symptoms.</p>
        </div>

        {/* AI Symptom Checker */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3>🤖 AI Medical Assistant</h3>
          <p className="muted">Get instant medical information and personalized health guidance.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            <button className="btn" onClick={() => navigate('/ai-assistant')} style={{ flex: 1 }}>
              🤖 Full AI Assistant
            </button>
            <button className="btn secondary" onClick={() => navigate('/find-doctors')}>
              🏥 Find Doctors
            </button>
          </div>

          <h4 style={{ marginTop: 20, marginBottom: 10 }}>Quick Symptom Checker</h4>
          <form onSubmit={handleSymptomCheck} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              style={{ flex: 1, minWidth: 260 }}
              placeholder="e.g. I have chest pain"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
            />
            <button className="btn" type="submit" disabled={aiBusy}>
              {aiBusy ? 'Checking...' : 'Check'}
            </button>
          </form>
          {aiError && <div className="error-text">{aiError}</div>}
          {aiResult && (
            <div style={{ marginTop: 12 }}>
              <span className="badge">Recommended: {aiResult.specialty}</span>
              <p className="muted" style={{ marginTop: 8 }}>{aiResult.advice}</p>
            </div>
          )}
        </div>

        {/* Doctor list */}
        <h2 className="section-title">Available Doctors</h2>
        {loading ? (
          <p>Loading doctors...</p>
        ) : (
          <div className="grid">
            {doctors.map((doc) => (
              <div className="card" key={doc.id}>
                <img className="doctor-img" src={doc.image} alt={doc.name} />
                <h3>{doc.name}</h3>
                <span className="badge">{doc.specialization}</span>
                <p className="muted" style={{ margin: '8px 0' }}>{doc.hospitalName}</p>
                <p className="muted">⭐ {doc.rating} • {doc.experience} yrs • ₹{doc.fee}</p>
                <button className="btn" style={{ marginTop: 8 }} onClick={() => openBooking(doc)}>
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Booking modal-like form */}
        {selectedDoctor && (
          <div className="card" style={{ marginTop: 24 }}>
            <h3>Book with {selectedDoctor.name}</h3>
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Available Slot</label>
                <select value={time} onChange={(e) => setTime(e.target.value)} required>
                  <option value="">Select a slot</option>
                  {selectedDoctor.availableSlots.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Reason (optional)</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} />
              </div>
              <button className="btn" type="submit">Confirm Booking</button>
              <button className="btn secondary" type="button" onClick={() => setSelectedDoctor(null)} style={{ marginLeft: 8 }}>
                Cancel
              </button>
            </form>
            {bookMsg && <div className="success-text">{bookMsg}</div>}
          </div>
        )}

        <p style={{ marginTop: 24 }}>
          <button className="btn secondary" onClick={() => navigate('/appointments')}>
            View My Appointments
          </button>
        </p>
      </div>
    </>
  );
}
