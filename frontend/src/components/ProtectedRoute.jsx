import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Guards a route: requires auth and optionally a specific role.
export default function ProtectedRoute({ children, allow }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="container">Loading...</div>;

  if (!user) return <Navigate to="/" replace />;

  if (allow && !allow.includes(user.role)) {
    // Redirect users to their own dashboard if role not allowed.
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
}
