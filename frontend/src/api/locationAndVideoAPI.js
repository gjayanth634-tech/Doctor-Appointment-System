import api from './api';

// ============ LOCATION & MAPS API ============

export const locationAPI = {
  // Geocode address to coordinates
  geocode: (address) => api.post('/location/geocode', { address }),

  // Reverse geocode coordinates to address
  reverseGeocode: (lat, lng) => api.post('/location/reverse-geocode', { lat, lng }),

  // Calculate distance between two points
  calculateDistance: (origin, destination) =>
    api.post('/location/distance', { origin, destination }),

  // Find nearby doctors/hospitals
  findNearby: (lat, lng, radius = 5000, type = 'hospital') =>
    api.post('/location/nearby', { lat, lng, radius, type }),

  // Get place details by ID
  getPlaceDetails: (placeId) => api.get(`/location/place/${placeId}`),

  // Get directions/route between two points
  getDirections: (origin, destination, mode = 'driving') =>
    api.post('/location/directions', { origin, destination, mode })
};

// ============ VIDEO CALL API ============

export const videoCallAPI = {
  // Generate Jitsi room token
  generateJitsiToken: (roomName, displayName) =>
    api.post('/video-call/jitsi-token', { roomName, displayName }),

  // Generate Twilio video token
  generateTwilioToken: (roomName, displayName) =>
    api.post('/video-call/twilio-token', { roomName, displayName }),

  // Start a video call session
  startSession: (appointmentId, roomName, initiatorId) =>
    api.post('/video-call/start', { appointmentId, roomName, initiatorId }),

  // Add participant to session
  addParticipant: (sessionId, participantId) =>
    api.post('/video-call/add-participant', { sessionId, participantId }),

  // End video call session
  endSession: (sessionId) => api.post('/video-call/end', { sessionId }),

  // Get session details
  getSession: (sessionId) => api.get(`/video-call/session/${sessionId}`),

  // Get all active sessions
  getActiveSessions: () => api.get('/video-call/active'),

  // Enable/disable screen sharing
  toggleScreenShare: (sessionId, participantId, enabled) =>
    api.post('/video-call/screen-share', { sessionId, participantId, enabled }),

  // Start/stop recording
  toggleRecording: (sessionId, action) =>
    api.post('/video-call/record', { sessionId, action }),

  // Send chat message during call
  sendChatMessage: (sessionId, message, senderId) =>
    api.post('/video-call/chat', { sessionId, message, senderId })
};

export default { locationAPI, videoCallAPI };
