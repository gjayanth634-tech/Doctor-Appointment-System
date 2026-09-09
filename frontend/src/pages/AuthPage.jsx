import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Unified Login / Register page.
// Switches between login and register, lets the user pick a role,
// and redirects to the correct dashboard based on the returned role.
export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const redirectByRole = (user) => {
    navigate(`/${user.role}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setBusy(true);
    try {
      let user;
      if (mode === 'login') {
        user = await login(form.email, form.password);
      } else {
        user = await register(form.name, form.email, form.password, role);
      }
      setSuccess(`${mode === 'login' ? 'Logged in' : 'Registered'} successfully!`);
      redirectByRole(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
        </div>
        <h2>{mode === 'login' ? 'Welcome Back 👋' : 'Create Account'}</h2>
        <p className="muted">Doctor Appointment & Telehealth System</p>

        <div className="toggle-row">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
            type="button"
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label>Register as</label>
              <select name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button className="btn" type="submit" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        {error && <div className="error-text">{error}</div>}
        {success && <div className="success-text">{success}</div>}
      </div>
    </div>
  );
}
