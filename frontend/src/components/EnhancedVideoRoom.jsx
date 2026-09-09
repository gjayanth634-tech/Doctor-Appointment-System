import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { videoCallAPI } from '../api/locationAndVideoAPI';

// Enhanced VideoRoom component with recording, screen sharing, and chat
export default function VideoRoom() {
  const { roomId } = useParams();
  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize video session and Jitsi
  useEffect(() => {
    if (!roomId) return;

    const initVideoSession = async () => {
      try {
        setLoading(true);

        // Start video call session
        const sessionResponse = await videoCallAPI.startSession(
          roomId,
          `room-${roomId}`,
          null
        );
        const newSessionId = sessionResponse.data.sessionId;
        setSessionId(newSessionId);

        // Generate Jitsi token
        const tokenResponse = await videoCallAPI.generateJitsiToken(
          `room-${roomId}`,
          'User'
        );

        // Load Jitsi API
        if (!window.JitsiMeetExternalAPI) {
          const script = document.createElement('script');
          script.src = 'https://meet.jit.si/external_api.js';
          script.async = true;
          document.body.appendChild(script);
          await new Promise(resolve => {
            script.onload = resolve;
          });
        }

        // Initialize Jitsi
        if (containerRef.current && window.JitsiMeetExternalAPI) {
          apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
            roomName: `room-${roomId}`,
            parentNode: containerRef.current,
            width: '100%',
            height: '100%',
            userInfo: { displayName: 'User' },
            configOverwrite: {
              prejoinPageEnabled: false,
              startWithAudioMuted: false,
              startWithVideoMuted: false
            },
            interfaceConfigOverwrite: {
              MOBILE_APP_PROMO: false,
              TOOLBAR_BUTTONS: [
                'microphone',
                'camera',
                'desktop',
                'fullscreen',
                'hangup',
                'chat',
                'profile',
                'recording'
              ]
            }
          });

          // Listen for participant events
          apiRef.current.addEventListener('participantJoined', (event) => {
            setParticipants(prev => [...prev, event.id]);
          });

          apiRef.current.addEventListener('participantLeft', (event) => {
            setParticipants(prev => prev.filter(id => id !== event.id));
          });
        }

        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to initialize video session');
        setLoading(false);
        console.error('Video session error:', err);
      }
    };

    initVideoSession();

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [roomId]);

  // Handle recording toggle
  const toggleRecording = async () => {
    try {
      if (!sessionId) return;
      await videoCallAPI.toggleRecording(
        sessionId,
        isRecording ? 'stop' : 'start'
      );
      setIsRecording(!isRecording);
    } catch (err) {
      setError('Failed to toggle recording');
      console.error('Recording error:', err);
    }
  };

  // Handle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (!sessionId) return;
      await videoCallAPI.toggleScreenShare(
        sessionId,
        null,
        !isScreenSharing
      );
      setIsScreenSharing(!isScreenSharing);
    } catch (err) {
      setError('Failed to toggle screen sharing');
      console.error('Screen sharing error:', err);
    }
  };

  // Handle chat message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    try {
      await videoCallAPI.sendChatMessage(sessionId, newMessage);
      setMessages([...messages, { text: newMessage, timestamp: new Date(), sender: 'You' }]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
      console.error('Chat error:', err);
    }
  };

  // Handle end call
  const endCall = async () => {
    try {
      if (sessionId) {
        await videoCallAPI.endSession(sessionId);
      }
      if (apiRef.current) {
        apiRef.current.dispose();
      }
      // Redirect to home or appointments page
      window.location.href = '/appointments';
    } catch (err) {
      console.error('End call error:', err);
    }
  };

  if (loading) return <div className="video-loading">Loading video call...</div>;
  if (error) return <div className="video-error">Error: {error}</div>;

  return (
    <div className="video-room-container">
      <div className="video-header">
        <span>TeleHealth Video Consultation</span>
      </div>
      <div className="video-main">
        <div className="video-box" ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="video-sidebar">
        {/* Controls */}
        <div className="video-controls">
          <button
            className={`control-btn ${isRecording ? 'active' : ''}`}
            onClick={toggleRecording}
            title="Toggle Recording"
          >
            🔴 {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>

          <button
            className={`control-btn ${isScreenSharing ? 'active' : ''}`}
            onClick={toggleScreenShare}
            title="Toggle Screen Sharing"
          >
            🖥️ {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          </button>

          <button
            className="control-btn end-call"
            onClick={endCall}
            title="End Call"
          >
            📞 End Call
          </button>
        </div>

        {/* Participants */}
        <div className="participants-panel">
          <h3>Participants ({participants.length + 1})</h3>
          <div className="participants-list">
            <div className="participant">👤 You</div>
            {participants.map(id => (
              <div key={id} className="participant">👤 {id}</div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="chat-panel">
          <h3>Chat</h3>
          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className="message">
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .video-room-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #000;
          color: #fff;
        }

        .video-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
          border-bottom: 1px solid #333;
          font-weight: bold;
          font-size: 14px;
        }

        .video-header-logo {
          width: 32px;
          height: 32px;
          object-fit: contain;
          filter: brightness(1.2);
        }

        .video-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-box {
          width: 100%;
          height: 100%;
        }

        .video-sidebar {
          width: 300px;
          background: #1a1a1a;
          border-left: 1px solid #333;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .video-controls {
          padding: 15px;
          border-bottom: 1px solid #333;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .control-btn {
          padding: 10px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
        }

        .control-btn:hover {
          background: #0056b3;
        }

        .control-btn.active {
          background: #dc3545;
        }

        .control-btn.end-call {
          background: #dc3545;
        }

        .control-btn.end-call:hover {
          background: #c82333;
        }

        .participants-panel,
        .chat-panel {
          flex: 1;
          padding: 15px;
          border-bottom: 1px solid #333;
          overflow-y: auto;
        }

        .participants-panel h3,
        .chat-panel h3 {
          margin-top: 0;
          font-size: 14px;
          text-transform: uppercase;
          color: #999;
        }

        .participants-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .participant {
          padding: 8px;
          background: #2a2a2a;
          border-radius: 3px;
          font-size: 12px;
        }

        .messages {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 10px;
          max-height: 200px;
          overflow-y: auto;
        }

        .message {
          padding: 8px;
          background: #2a2a2a;
          border-radius: 3px;
          font-size: 12px;
          line-height: 1.4;
        }

        .message-form {
          display: flex;
          gap: 5px;
        }

        .message-form input {
          flex: 1;
          padding: 8px;
          border: 1px solid #444;
          border-radius: 3px;
          background: #2a2a2a;
          color: #fff;
          font-size: 12px;
        }

        .message-form button {
          padding: 8px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-weight: bold;
        }

        .message-form button:hover {
          background: #0056b3;
        }

        .video-loading,
        .video-error {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-size: 18px;
        }

        .video-error {
          color: #dc3545;
        }
      `}</style>
    </div>
  );
}
