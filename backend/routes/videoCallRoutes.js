import express from 'express';
import crypto from 'crypto';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const JITSI_API_KEY = process.env.JITSI_API_KEY || 'YOUR_JITSI_API_KEY';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_ACCOUNT_SID';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_AUTH_TOKEN';
const TWILIO_API_KEY = process.env.TWILIO_API_KEY || 'YOUR_TWILIO_API_KEY';
const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET || 'YOUR_TWILIO_API_SECRET';

// Store active video sessions
const activeSessions = new Map();

// ✅ Generate Jitsi room token (JWT)
router.post('/jitsi-token', authMiddleware, (req, res) => {
  try {
    const { roomName, displayName } = req.body;
    if (!roomName || !displayName) {
      return res.status(400).json({ message: 'Room name and display name required' });
    }

    // For Jitsi, we can use the room name directly or generate a JWT
    // The simple approach: use the room name directly from Jitsi's public API
    // For production, use JWT signing with Jitsi's private key
    
    const token = crypto.randomBytes(16).toString('hex');
    const sessionId = `${roomName}-${token}`;

    activeSessions.set(sessionId, {
      roomName,
      displayName,
      userId: req.user.id,
      startTime: new Date(),
      participants: [req.user.id]
    });

    res.json({
      token: sessionId,
      roomName,
      apiUrl: 'https://meet.jit.si',
      externalApiUrl: 'https://meet.jit.si/external_api.js'
    });
  } catch (error) {
    res.status(500).json({ message: 'Token generation error', error: error.message });
  }
});

// ✅ Create Twilio video room (alternative to Jitsi)
router.post('/twilio-token', authMiddleware, (req, res) => {
  try {
    const { roomName, displayName } = req.body;
    if (!roomName || !displayName) {
      return res.status(400).json({ message: 'Room name and display name required' });
    }

    // For production, implement Twilio JWT token generation
    // This requires twilio SDK
    const token = {
      token: 'TWILIO_TOKEN_PLACEHOLDER',
      roomName,
      displayName
    };

    res.json({
      ...token,
      provider: 'twilio',
      warning: 'Configure TWILIO_AUTH_TOKEN and TWILIO_API_KEY for production'
    });
  } catch (error) {
    res.status(500).json({ message: 'Twilio token error', error: error.message });
  }
});

// ✅ Initialize video call session
router.post('/start', authMiddleware, (req, res) => {
  try {
    const { appointmentId, roomName, initiatorId } = req.body;
    if (!appointmentId || !roomName) {
      return res.status(400).json({ message: 'Appointment ID and room name required' });
    }

    const sessionId = `session-${appointmentId}-${Date.now()}`;

    const session = {
      sessionId,
      appointmentId,
      roomName,
      initiatorId: initiatorId || req.user.id,
      startTime: new Date(),
      participants: [req.user.id],
      status: 'active',
      recordingUrl: null
    };

    activeSessions.set(sessionId, session);

    res.json({
      sessionId,
      message: 'Video call session started',
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Session start error', error: error.message });
  }
});

// ✅ Add participant to session
router.post('/add-participant', authMiddleware, (req, res) => {
  try {
    const { sessionId, participantId } = req.body;
    if (!sessionId || !participantId) {
      return res.status(400).json({ message: 'Session ID and participant ID required' });
    }

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (!session.participants.includes(participantId)) {
      session.participants.push(participantId);
    }

    res.json({
      message: 'Participant added',
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Add participant error', error: error.message });
  }
});

// ✅ End video call session
router.post('/end', authMiddleware, (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID required' });
    }

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.status = 'ended';
    session.endTime = new Date();
    session.duration = Math.round((session.endTime - session.startTime) / 1000);

    const endedSession = { ...session };
    activeSessions.delete(sessionId);

    res.json({
      message: 'Video call session ended',
      session: endedSession
    });
  } catch (error) {
    res.status(500).json({ message: 'Session end error', error: error.message });
  }
});

// ✅ Get session details
router.get('/session/:sessionId', authMiddleware, (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = activeSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ session });
  } catch (error) {
    res.status(500).json({ message: 'Session retrieval error', error: error.message });
  }
});

// ✅ Get all active sessions
router.get('/active', authMiddleware, (req, res) => {
  try {
    const sessions = Array.from(activeSessions.values());
    res.json({
      count: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({ message: 'Sessions retrieval error', error: error.message });
  }
});

// ✅ Enable screen sharing
router.post('/screen-share', authMiddleware, (req, res) => {
  try {
    const { sessionId, participantId, enabled } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID required' });
    }

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      message: `Screen sharing ${enabled ? 'enabled' : 'disabled'}`,
      sessionId,
      participantId,
      enabled
    });
  } catch (error) {
    res.status(500).json({ message: 'Screen share error', error: error.message });
  }
});

// ✅ Record session
router.post('/record', authMiddleware, (req, res) => {
  try {
    const { sessionId, action } = req.body; // action: 'start' or 'stop'
    if (!sessionId || !action) {
      return res.status(400).json({ message: 'Session ID and action required' });
    }

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (action === 'start') {
      session.recording = true;
      session.recordingStartTime = new Date();
    } else if (action === 'stop') {
      session.recording = false;
      // In production, generate recording URL from Jitsi or Twilio
      session.recordingUrl = `https://storage.example.com/recordings/${session.sessionId}.mp4`;
    }

    res.json({
      message: `Recording ${action}ed`,
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Recording error', error: error.message });
  }
});

// ✅ Send chat message during call
router.post('/chat', authMiddleware, (req, res) => {
  try {
    const { sessionId, message, senderId } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ message: 'Session ID and message required' });
    }

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (!session.chatMessages) {
      session.chatMessages = [];
    }

    session.chatMessages.push({
      senderId: senderId || req.user.id,
      message,
      timestamp: new Date()
    });

    res.json({
      message: 'Message sent',
      chatMessage: {
        senderId,
        message,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Chat error', error: error.message });
  }
});

export default router;
