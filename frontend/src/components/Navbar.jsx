import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

// Top navigation shown on authenticated dashboards. Role-aware links.
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="brand-section">
        <div className="brand">TeleHealth</div>
      </div>
      <div className="links">
        <span className="badge">{user.role.toUpperCase()}</span>
        <span className="muted">Hi, {user.name}</span>
        <button onClick={() => navigate('/')}>Home</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
