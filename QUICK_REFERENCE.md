# 🚀 Quick Reference - Maps & Video Call APIs

## 📍 Location API Quick Start

```javascript
import { locationAPI } from './api/locationAndVideoAPI';

// Find doctors near you
await locationAPI.findNearby(
  40.7128,        // latitude
  -74.0060,       // longitude
  5000,           // radius (meters)
  'hospital'      // type
);

// Get directions
await locationAPI.getDirections(
  {lat: 40.7128, lng: -74.0060},
  {lat: 40.7580, lng: -73.9855},
  'driving'
);

// Geocode address
await locationAPI.geocode('Times Square, New York');

// Calculate distance
await locationAPI.calculateDistance(
  '123 Main St',
  '456 Park Ave'
);
```

---

## 📞 Video Call API Quick Start

```javascript
import { videoCallAPI } from './api/locationAndVideoAPI';

// Start session
const session = await videoCallAPI.startSession(
  'appointment-123',
  'room-name',
  'doctor-id'
);

// Get Jitsi token
const token = await videoCallAPI.generateJitsiToken(
  'room-name',
  'Dr. Smith'
);

// Toggle recording
await videoCallAPI.toggleRecording(sessionId, 'start');
await videoCallAPI.toggleRecording(sessionId, 'stop');

// Toggle screen share
await videoCallAPI.toggleScreenShare(sessionId, userId, true);

// Send message
await videoCallAPI.sendChatMessage(sessionId, 'Hello!');

// End session
await videoCallAPI.endSession(sessionId);
```

---

## 🔑 Environment Variables Needed

```env
# Google Maps
GOOGLE_MAPS_API_KEY=sk-...

# Jitsi (optional config)
JITSI_API_KEY=...

# Twilio (alternative video)
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
```

---

## 🛣️ Frontend Routes

```
/find-doctors              → DoctorLocations component
/enhanced-video/:roomId    → EnhancedVideoRoom component
```

---

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/location/geocode` | Address → Coordinates |
| POST | `/api/location/nearby` | Find nearby places |
| POST | `/api/location/distance` | Calculate distance |
| POST | `/api/location/directions` | Get route |
| POST | `/api/video-call/start` | Start session |
| POST | `/api/video-call/record` | Toggle recording |
| POST | `/api/video-call/screen-share` | Toggle screen share |
| POST | `/api/video-call/chat` | Send message |

---

## ⚡ Testing Commands

```bash
# Geocode
curl -X POST http://localhost:5000/api/location/geocode \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"address":"Times Square, New York"}'

# Find nearby
curl -X POST http://localhost:5000/api/location/nearby \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"lat":40.7128,"lng":-74.0060,"type":"hospital"}'

# Start video session
curl -X POST http://localhost:5000/api/video-call/start \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"appointmentId":"apt-123","roomName":"room-123"}'
```

---

## 📂 New Files Created

| File | Purpose |
|------|---------|
| `backend/routes/locationRoutes.js` | Maps API endpoints |
| `backend/routes/videoCallRoutes.js` | Video call endpoints |
| `frontend/src/api/locationAndVideoAPI.js` | API client functions |
| `frontend/src/components/DoctorLocations.jsx` | Maps UI component |
| `frontend/src/components/EnhancedVideoRoom.jsx` | Video room component |
| `API_DOCUMENTATION.md` | Full API reference |
| `SETUP_GUIDE.md` | Configuration guide |

---

## 🎯 Integration Steps

1. ✅ Add API keys to `.env`
2. ✅ Restart backend server
3. ✅ Import API functions in your components
4. ✅ Use the components or call APIs directly
5. ✅ Add links to navbar/dashboard

---

## 💡 Usage in Components

```jsx
// In any React component
import { locationAPI, videoCallAPI } from '../api/locationAndVideoAPI';

// Use in useEffect or event handlers
const findDoctors = async () => {
  const result = await locationAPI.findNearby(lat, lng, 5000, 'hospital');
  console.log(result.data.places);
};

const startCall = async () => {
  const session = await videoCallAPI.startSession('apt-123', 'room');
  navigate(`/enhanced-video/${session.data.sessionId}`);
};
```

---

## 🚀 Common Workflows

### Finding Nearby Doctors
1. Get user location → `navigator.geolocation`
2. Call `locationAPI.findNearby(lat, lng)`
3. Display results in UI
4. On click → call `locationAPI.getDirections()`

### Video Consultation
1. Start appointment
2. Call `videoCallAPI.startSession(appointmentId, roomName)`
3. Get Jitsi token with `videoCallAPI.generateJitsiToken()`
4. Embed Jitsi in `<EnhancedVideoRoom>`
5. Toggle features (recording, screen share, chat)
6. End with `videoCallAPI.endSession(sessionId)`

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "API key not valid" | Check GOOGLE_MAPS_API_KEY in .env |
| "No location found" | Verify address spelling and Google Maps API enabled |
| "Jitsi not loading" | Check browser console, ensure https://meet.jit.si is accessible |
| "Permission denied" | Browser needs location permission - check settings |

---

## 📞 Need Help?

- 📖 See `API_DOCUMENTATION.md` for detailed endpoints
- 🔧 See `SETUP_GUIDE.md` for configuration
- 📋 See `INTEGRATION_SUMMARY.md` for overview

---

## ✅ Status

- ✅ Backend APIs: Ready
- ✅ Frontend Components: Ready
- ✅ Documentation: Complete
- ✅ Servers: Running
- ✅ Ready for Production!

Last Updated: 2024-01-15 | Version: 1.0

