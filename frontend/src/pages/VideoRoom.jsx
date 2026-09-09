import { useParams, useNavigate } from 'react-router-dom';
import JitsiMeet from '../components/JitsiMeet.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

// VIDEO CONSULTATION ROOM
// Route: /room/:roomId
// Dynamically embeds a Jitsi Meet 1-on-1 video session using the room name.
export default function VideoRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Video Consultation</h1>
          <button className="btn danger" onClick={() => navigate(-1)}>Leave Call</button>
        </div>
        <p className="muted">Room: <code>{roomId}</code></p>
        <JitsiMeet roomName={roomId} displayName={user?.name || 'Participant'} />
      </div>
    </>
  );
}
