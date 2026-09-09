# Doctor Appointment System - API Documentation

## Overview
This document provides a comprehensive guide to all APIs integrated into the Doctor Appointment & Telehealth System, including location/maps services and video call management.

---

## 🗺️ LOCATION & MAPS APIs

### Base URL
```
http://localhost:5000/api/location
```

### Endpoints

#### 1. **Geocode Address to Coordinates**
Convert an address to latitude/longitude coordinates.

```http
POST /geocode
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "address": "123 Main St, New York, NY 10001"
}
```

**Response:**
```json
{
  "address": "123 Main Street, New York, NY 10001, USA",
  "lat": 40.7128,
  "lng": -74.0060
}
```

---

#### 2. **Reverse Geocode Coordinates to Address**
Convert latitude/longitude to an address.

```http
POST /reverse-geocode
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "lat": 40.7128,
  "lng": -74.0060
}
```

**Response:**
```json
{
  "address": "123 Main Street, New York, NY 10001, USA",
  "lat": 40.7128,
  "lng": -74.0060
}
```

---

#### 3. **Calculate Distance Between Two Points**
Calculate distance and travel time between two locations.

```http
POST /distance
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "origin": { "lat": 40.7128, "lng": -74.0060 },
  "destination": { "lat": 40.7580, "lng": -73.9855 }
}
```

**Alternative using addresses:**
```json
{
  "origin": "123 Main St, New York, NY",
  "destination": "456 Park Ave, New York, NY"
}
```

**Response:**
```json
{
  "distance": {
    "text": "2.1 km",
    "value": 2089
  },
  "duration": {
    "text": "8 mins",
    "value": 467
  },
  "status": "OK"
}
```

---

#### 4. **Find Nearby Doctors/Clinics**
Search for nearby hospitals, clinics, doctors, or other medical facilities.

```http
POST /nearby
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "lat": 40.7128,
  "lng": -74.0060,
  "radius": 5000,
  "type": "hospital"
}
```

**Parameters:**
- `lat` (float, required): User's latitude
- `lng` (float, required): User's longitude
- `radius` (int, optional): Search radius in meters (default: 5000)
- `type` (string, optional): Place type - `hospital`, `doctor`, `clinic`, `dentist`, `pharmacy`, etc.

**Response:**
```json
{
  "places": [
    {
      "id": "ChIJ...",
      "name": "New York Hospital",
      "address": "525 E 68th St, New York, NY",
      "lat": 40.7614,
      "lng": -73.9776,
      "rating": 4.5,
      "types": ["hospital", "health"]
    }
  ]
}
```

---

#### 5. **Get Place Details**
Get detailed information about a specific place/clinic.

```http
GET /place/{placeId}
Authorization: Bearer {TOKEN}
```

**Response:**
```json
{
  "name": "New York Hospital",
  "address": "525 E 68th St, New York, NY 10065, USA",
  "phone": "+1 (212) 746-5454",
  "website": "https://www.nyp.org",
  "lat": 40.7614,
  "lng": -73.9776,
  "rating": 4.5,
  "hours": {
    "weekday_text": [
      "Monday: Open 24 hours",
      "Tuesday: Open 24 hours"
    ]
  },
  "reviews": [
    {
      "author": "John Doe",
      "rating": 5,
      "text": "Great service!"
    }
  ]
}
```

---

#### 6. **Get Directions/Routes**
Get turn-by-turn directions and route information.

```http
POST /directions
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "origin": { "lat": 40.7128, "lng": -74.0060 },
  "destination": { "lat": 40.7614, "lng": -73.9776 },
  "mode": "driving"
}
```

**Parameters:**
- `origin` (object/string, required): Starting location
- `destination` (object/string, required): Ending location
- `mode` (string, optional): Travel mode - `driving`, `walking`, `transit`, `bicycling`

**Response:**
```json
{
  "distance": {
    "text": "3.5 km",
    "value": 3500
  },
  "duration": {
    "text": "12 mins",
    "value": 720
  },
  "steps": [
    {
      "instruction": "Head north on 5th Ave",
      "distance": "0.2 km",
      "duration": "1 min"
    }
  ],
  "polyline": "encoded_polyline_string"
}
```

---

## 📞 VIDEO CALL APIs

### Base URL
```
http://localhost:5000/api/video-call
```

### Endpoints

#### 1. **Generate Jitsi Token**
Get a token to join a Jitsi Meet video room.

```http
POST /jitsi-token
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "roomName": "doctor-patient-123",
  "displayName": "Dr. Smith"
}
```

**Response:**
```json
{
  "token": "session-abc123def456",
  "roomName": "doctor-patient-123",
  "apiUrl": "https://meet.jit.si",
  "externalApiUrl": "https://meet.jit.si/external_api.js"
}
```

---

#### 2. **Generate Twilio Token**
Get a token for Twilio video (alternative to Jitsi).

```http
POST /twilio-token
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "roomName": "doctor-patient-123",
  "displayName": "Dr. Smith"
}
```

**Response:**
```json
{
  "token": "twilio_token_string",
  "roomName": "doctor-patient-123",
  "displayName": "Dr. Smith",
  "provider": "twilio"
}
```

---

#### 3. **Start Video Call Session**
Initialize a new video call session for an appointment.

```http
POST /start
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "appointmentId": "appointment-123",
  "roomName": "appointment-123-room",
  "initiatorId": "doctor-user-id"
}
```

**Response:**
```json
{
  "sessionId": "session-appointment-123-1234567890",
  "message": "Video call session started",
  "session": {
    "sessionId": "session-appointment-123-1234567890",
    "appointmentId": "appointment-123",
    "roomName": "appointment-123-room",
    "initiatorId": "doctor-user-id",
    "startTime": "2024-01-15T10:30:00Z",
    "participants": ["doctor-user-id"],
    "status": "active",
    "recordingUrl": null
  }
}
```

---

#### 4. **Add Participant to Session**
Add a new participant (patient) to an active video call session.

```http
POST /add-participant
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "sessionId": "session-appointment-123-1234567890",
  "participantId": "patient-user-id"
}
```

**Response:**
```json
{
  "message": "Participant added",
  "session": {
    "sessionId": "session-appointment-123-1234567890",
    "participants": ["doctor-user-id", "patient-user-id"],
    "status": "active"
  }
}
```

---

#### 5. **End Video Call Session**
End an active video call session.

```http
POST /end
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "sessionId": "session-appointment-123-1234567890"
}
```

**Response:**
```json
{
  "message": "Video call session ended",
  "session": {
    "sessionId": "session-appointment-123-1234567890",
    "status": "ended",
    "endTime": "2024-01-15T10:45:00Z",
    "duration": 900
  }
}
```

---

#### 6. **Get Session Details**
Retrieve details of a specific video call session.

```http
GET /session/{sessionId}
Authorization: Bearer {TOKEN}
```

**Response:**
```json
{
  "session": {
    "sessionId": "session-appointment-123-1234567890",
    "appointmentId": "appointment-123",
    "roomName": "appointment-123-room",
    "initiatorId": "doctor-user-id",
    "startTime": "2024-01-15T10:30:00Z",
    "participants": ["doctor-user-id", "patient-user-id"],
    "status": "active",
    "recording": true,
    "recordingStartTime": "2024-01-15T10:30:30Z"
  }
}
```

---

#### 7. **Get All Active Sessions**
Retrieve all currently active video call sessions.

```http
GET /active
Authorization: Bearer {TOKEN}
```

**Response:**
```json
{
  "count": 2,
  "sessions": [
    {
      "sessionId": "session-appointment-123-1234567890",
      "status": "active",
      "participants": ["doctor-1", "patient-1"]
    },
    {
      "sessionId": "session-appointment-456-1234567890",
      "status": "active",
      "participants": ["doctor-2", "patient-2"]
    }
  ]
}
```

---

#### 8. **Toggle Screen Sharing**
Enable or disable screen sharing in a video call.

```http
POST /screen-share
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "sessionId": "session-appointment-123-1234567890",
  "participantId": "doctor-user-id",
  "enabled": true
}
```

**Response:**
```json
{
  "message": "Screen sharing enabled",
  "sessionId": "session-appointment-123-1234567890",
  "participantId": "doctor-user-id",
  "enabled": true
}
```

---

#### 9. **Toggle Recording**
Start or stop recording a video call session.

```http
POST /record
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "sessionId": "session-appointment-123-1234567890",
  "action": "start"
}
```

**Parameters:**
- `action` (string, required): Either `"start"` or `"stop"`

**Response:**
```json
{
  "message": "Recording started",
  "session": {
    "sessionId": "session-appointment-123-1234567890",
    "recording": true,
    "recordingStartTime": "2024-01-15T10:30:30Z",
    "recordingUrl": "https://storage.example.com/recordings/session-123.mp4"
  }
}
```

---

#### 10. **Send Chat Message**
Send a text message during a video call session.

```http
POST /chat
Content-Type: application/json
Authorization: Bearer {TOKEN}

{
  "sessionId": "session-appointment-123-1234567890",
  "message": "Please check this report",
  "senderId": "doctor-user-id"
}
```

**Response:**
```json
{
  "message": "Message sent",
  "chatMessage": {
    "senderId": "doctor-user-id",
    "message": "Please check this report",
    "timestamp": "2024-01-15T10:35:00Z"
  }
}
```

---

## 🔑 Environment Setup

Create a `.env` file in the backend directory with the following keys:

```env
# Location & Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
MAPBOX_API_KEY=your_mapbox_api_key

# Video Calls
JITSI_API_KEY=your_jitsi_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_API_KEY=your_twilio_api_key
TWILIO_API_SECRET=your_twilio_api_secret
```

---

## 📱 Frontend Usage Examples

### Using Location API

```javascript
import { locationAPI } from './api/locationAndVideoAPI';

// Find nearby doctors
const response = await locationAPI.findNearby(40.7128, -74.0060, 5000, 'hospital');
```

### Using Video Call API

```javascript
import { videoCallAPI } from './api/locationAndVideoAPI';

// Start a video call session
const session = await videoCallAPI.startSession('appointment-123', 'room-123', 'doctor-id');

// Join Jitsi
const token = await videoCallAPI.generateJitsiToken('room-123', 'Dr. Smith');
```

---

## ✅ Testing the APIs

Use Postman or curl to test the APIs:

```bash
# Geocode an address
curl -X POST http://localhost:5000/api/location/geocode \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"address":"Times Square, New York"}'

# Find nearby hospitals
curl -X POST http://localhost:5000/api/location/nearby \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"lat":40.7128,"lng":-74.0060,"type":"hospital"}'

# Start video call
curl -X POST http://localhost:5000/api/video-call/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"appointmentId":"apt-123","roomName":"room-123","initiatorId":"doc-1"}'
```

---

## 🚀 Integration Checklist

- [x] Location & Maps APIs integrated
- [x] Video Call management APIs integrated
- [x] Frontend components created
- [ ] Google Maps API key configured
- [ ] Twilio credentials configured (optional)
- [ ] Jitsi configuration setup
- [ ] Frontend routes added to App.jsx
- [ ] Testing completed

