# 🚀 Setup Guide - Maps & Video Call APIs

This guide will help you configure and use the newly integrated Location/Maps and Video Call APIs in your Doctor Appointment System.

## 📋 What's New

### Backend APIs Added:
1. **Location & Maps Routes** (`/api/location/*`)
   - Geocoding (address → coordinates)
   - Reverse Geocoding (coordinates → address)
   - Distance calculation
   - Find nearby doctors/clinics
   - Place details
   - Directions/routes

2. **Video Call Management Routes** (`/api/video-call/*`)
   - Jitsi token generation
   - Twilio token generation
   - Session management
   - Participant management
   - Screen sharing
   - Recording
   - In-call chat

### Frontend Components Added:
1. **DoctorLocations.jsx** - Find nearby doctors and clinics
2. **EnhancedVideoRoom.jsx** - Advanced video call features
3. **locationAndVideoAPI.js** - API client functions

---

## 🔧 Step 1: Get API Keys

### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable these APIs:
   - Google Maps API
   - Geocoding API
   - Distance Matrix API
   - Places API
   - Directions API
4. Create an API key (Credentials → API key)
5. Copy the key to your `.env` file

### Twilio (Optional - for alternative video)
1. Sign up at [Twilio](https://www.twilio.com)
2. Get your Account SID and Auth Token
3. Create an API key (not required if using Jitsi only)
4. Add credentials to `.env`

---

## ⚙️ Step 2: Configure Environment Variables

Create/update `.env` file in the backend directory:

```env
# Existing variables
MONGO_URI=mongodb://localhost:27017/doctor-appointment-system
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here

# New API Keys
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
MAPBOX_API_KEY=your_mapbox_api_key_here
JITSI_API_KEY=your_jitsi_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_API_KEY=your_twilio_api_key_here
TWILIO_API_SECRET=your_twilio_api_secret_here
```

---

## 🔄 Step 3: Restart Backend Server

The backend already includes the new routes. Just restart it:

```bash
cd backend
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

---

## 🌐 Step 4: Frontend Routes

The frontend App.jsx has already been updated with these new routes:

- `/find-doctors` - Map view with nearby doctors
- `/enhanced-video/:roomId` - Advanced video call room

Access them in your application:
```javascript
// Navigate to find doctors
navigate('/find-doctors');

// Join enhanced video call
navigate('/enhanced-video/appointment-123');
```

---

## 📱 Step 5: Testing the APIs

### Test Location API
```bash
# Geocode an address
curl -X POST http://localhost:5000/api/location/geocode \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"address":"Times Square, New York, NY"}'
```

### Test Video Call API
```bash
# Start a video session
curl -X POST http://localhost:5000/api/video-call/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"appointmentId":"apt-123","roomName":"room-123","initiatorId":"doc-1"}'
```

---

## 🎨 Integration in Components

### Using Location API

```javascript
import { locationAPI } from '../api/locationAndVideoAPI';

// Find nearby doctors within 5km
const response = await locationAPI.findNearby(
  40.7128,      // latitude
  -74.0060,     // longitude
  5000,         // radius in meters
  'hospital'    // place type
);

console.log(response.data.places);
```

### Using Video Call API

```javascript
import { videoCallAPI } from '../api/locationAndVideoAPI';

// Start a video call session
const session = await videoCallAPI.startSession(
  'appointment-123',
  'room-123',
  'doctor-id'
);

// Generate Jitsi token
const token = await videoCallAPI.generateJitsiToken(
  'room-123',
  'Dr. Smith'
);

// Toggle recording
await videoCallAPI.toggleRecording(session.data.sessionId, 'start');

// Send chat message
await videoCallAPI.sendChatMessage(
  session.data.sessionId,
  'Patient reports nausea',
  'doctor-id'
);
```

---

## 📂 File Structure

```
doctor-appointment-system/
├── backend/
│   ├── routes/
│   │   ├── locationRoutes.js          ✨ NEW
│   │   ├── videoCallRoutes.js         ✨ NEW
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── aiRoutes.js
│   ├── .env.example                   ✨ UPDATED
│   ├── server.js                      ✨ UPDATED
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.js
│   │   │   └── locationAndVideoAPI.js ✨ NEW
│   │   ├── components/
│   │   │   ├── DoctorLocations.jsx    ✨ NEW
│   │   │   ├── EnhancedVideoRoom.jsx  ✨ NEW
│   │   │   ├── Navbar.jsx
│   │   │   ├── JitsiMeet.jsx
│   │   │   └── ...
│   │   ├── App.jsx                    ✨ UPDATED
│   │   └── ...
│   └── ...
│
├── API_DOCUMENTATION.md               ✨ NEW
├── SETUP_GUIDE.md                     ✨ NEW (this file)
└── ...
```

---

## 🐛 Troubleshooting

### "Google Maps API Key Error"
- Verify API key is correct in `.env`
- Check that Google Maps, Geocoding, and Places APIs are enabled
- Ensure the key has proper restrictions (if any)

### "Location permission denied"
- Browser needs permission to access user's location
- Check browser settings for location permissions
- Handle error gracefully in your component

### "Video call not loading"
- Ensure Jitsi Meet external API loads
- Check browser console for CORS issues
- Verify authentication token is being sent

### "No nearby results"
- Increase search radius
- Verify latitude/longitude are correct
- Check if Google Maps API has coverage in that area

---

## 🔐 Security Considerations

1. **API Keys**: Never commit `.env` to version control
2. **Authentication**: All location/video APIs require JWT token
3. **CORS**: Backend is configured to allow localhost:5173
4. **Privacy**: Collect location data only with user consent
5. **Recording**: Notify participants when recording is active

---

## 🚀 Next Steps

1. ✅ Configure API keys
2. ✅ Restart backend server
3. ✅ Test endpoints with Postman/curl
4. ✅ Test frontend components
5. ✅ Integrate into your UI (Navbar links, dashboard buttons, etc.)
6. ✅ Deploy to production

---

## 📚 Additional Resources

- [Google Maps API Documentation](https://developers.google.com/maps)
- [Jitsi Meet Developer Guide](https://jitsi.org/user-faq/meet-faq/)
- [Twilio Video Documentation](https://www.twilio.com/docs/video)
- [Full API Documentation](./API_DOCUMENTATION.md)

---

## 💬 Support

For issues or questions:
1. Check the API_DOCUMENTATION.md
2. Review error messages in browser console
3. Test endpoints with Postman
4. Check backend logs for server errors

Happy coding! 🎉

