import { useState, useEffect } from 'react';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

// ADMIN DASHBOARD
// - System statistics (doctors, appointments, users)
// - Monitor registered users
// - Add new doctor profiles (in-memory for the session)
export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({ doctors: 0, appointments: 0, users: 0 });
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Add-doctor form state
  const [form, setForm] = useState({
    name: '', specialization: '', hospitalName: '', experience: '', fee: '', rating: '', image: ''
  });
  const [msg, setMsg] = useState('');

  const refresh = () => {
    api.get('/doctors').then((r) => setDoctors(r.data.doctors));
    api.get('/appointments').then((r) => {
      const appts = r.data.appointments;
      setStats((s) => ({ ...s, appointments: appts.length, doctors: doctors.length }));
      setStats((s) => ({ ...s, appointments: appts.length }));
    });
    api.get('/auth/users').then((r) => {
      setUsers(r.data.users);
      setStats((s) => ({ ...s, users: r.data.count }));
    });
    api.get('/doctors').then((r) => setStats((s) => ({ ...s, doctors: r.data.count })));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addDoctor = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/doctors', {
        ...form,
        experience: Number(form.experience),
        fee: Number(form.fee),
        rating: Number(form.rating)
      });
      setMsg('Doctor added successfully');
      setForm({ name: '', specialization: '', hospitalName: '', experience: '', fee: '', rating: '', image: '' });
      refresh();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add doctor');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 20 }}>
          <h1 style={{ margin: '0 0 8px 0' }}>Admin Dashboard</h1>
          <p className="muted">System overview and management for {user.name}.</p>
        </div>

        <div className="stat-grid" style={{ marginTop: 16 }}>
          <div className="stat"><div className="num">{stats.doctors}</div><div className="label">Doctors</div></div>
          <div className="stat"><div className="num">{stats.appointments}</div><div className="label">Appointments</div></div>
          <div className="stat"><div className="num">{stats.users}</div><div className="label">Users</div></div>
        </div>

        <h2 className="section-title">Registered Users</h2>
        <div className="grid">
          {users.map((u) => (
            <div className="card" key={u._id}>
              <h3>{u.name}</h3>
              <p className="muted">{u.email}</p>
              <span className="badge">{u.role}</span>
            </div>
          ))}
        </div>

        <h2 className="section-title">Add Doctor Profile</h2>
        <div className="card" style={{ maxWidth: 520 }}>
          <form onSubmit={addDoctor}>
            <div className="form-group">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <input name="specialization" value={form.specialization} onChange={handleChange} required />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Hospital</label>
                <input name="hospitalName" value={form.hospitalName} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Experience (yrs)</label>
                <input type="number" name="experience" value={form.experience} onChange={handleChange} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Fee</label>
                <input type="number" name="fee" value={form.fee} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Rating</label>
                <input type="number" step="0.1" name="rating" value={form.rating} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
            </div>
            <button className="btn" type="submit">Add Doctor</button>
          </form>
          {msg && <div className="success-text">{msg}</div>}
        </div>

        <h2 className="section-title">Current Doctors ({doctors.length})</h2>
        <div className="grid">
          {doctors.map((d) => (
            <div className="card" key={d.id}>
              <h3>{d.name}</h3>
              <span className="badge">{d.specialization}</span>
              <p className="muted" style={{ marginTop: 8 }}>{d.hospitalName}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
