import express from 'express';
import axios from 'axios';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';
const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY || 'YOUR_MAPBOX_API_KEY';

// ✅ Get coordinates from address (Geocoding)
router.post('/geocode', authMiddleware, async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ message: 'Address is required' });

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address,
          key: GOOGLE_MAPS_API_KEY
        }
      }
    );

    if (response.data.results.length === 0) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const location = response.data.results[0].geometry.location;
    res.json({
      address: response.data.results[0].formatted_address,
      lat: location.lat,
      lng: location.lng
    });
  } catch (error) {
    res.status(500).json({ message: 'Geocoding error', error: error.message });
  }
});

// ✅ Get address from coordinates (Reverse Geocoding)
router.post('/reverse-geocode', authMiddleware, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) return res.status(400).json({ message: 'Latitude and Longitude required' });

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          latlng: `${lat},${lng}`,
          key: GOOGLE_MAPS_API_KEY
        }
      }
    );

    if (response.data.results.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({
      address: response.data.results[0].formatted_address,
      lat,
      lng
    });
  } catch (error) {
    res.status(500).json({ message: 'Reverse geocoding error', error: error.message });
  }
});

// ✅ Calculate distance between two points
router.post('/distance', authMiddleware, async (req, res) => {
  try {
    const { origin, destination } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination required' });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json`,
      {
        params: {
          origins: typeof origin === 'object' ? `${origin.lat},${origin.lng}` : origin,
          destinations: typeof destination === 'object' ? `${destination.lat},${destination.lng}` : destination,
          key: GOOGLE_MAPS_API_KEY
        }
      }
    );

    if (response.data.status !== 'OK') {
      return res.status(400).json({ message: 'Distance calculation failed' });
    }

    const element = response.data.rows[0].elements[0];
    res.json({
      distance: element.distance,
      duration: element.duration,
      status: element.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Distance calculation error', error: error.message });
  }
});

// ✅ Get nearby doctors/clinics
router.post('/nearby', authMiddleware, async (req, res) => {
  try {
    const { lat, lng, radius = 5000, type = 'hospital' } = req.body;
    if (!lat || !lng) return res.status(400).json({ message: 'Latitude and Longitude required' });

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius,
          type,
          key: GOOGLE_MAPS_API_KEY
        }
      }
    );

    res.json({
      places: response.data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        rating: place.rating,
        types: place.types
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Nearby search error', error: error.message });
  }
});

// ✅ Get place details
router.get('/place/:placeId', authMiddleware, async (req, res) => {
  try {
    const { placeId } = req.params;

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: placeId,
          key: GOOGLE_MAPS_API_KEY
        }
      }
    );

    const place = response.data.result;
    res.json({
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number,
      website: place.website,
      hours: place.opening_hours,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      rating: place.rating,
      reviews: place.reviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Place details error', error: error.message });
  }
});

// ✅ Get routes/directions
router.post('/directions', authMiddleware, async (req, res) => {
  try {
    const { origin, destination, mode = 'driving' } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination required' });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin: typeof origin === 'object' ? `${origin.lat},${origin.lng}` : origin,
          destination: typeof destination === 'object' ? `${destination.lat},${destination.lng}` : destination,
          mode,
          key: GOOGLE_MAPS_API_KEY
        }
      }
    );

    if (response.data.status !== 'OK') {
      return res.status(400).json({ message: 'Directions not found' });
    }

    const route = response.data.routes[0];
    res.json({
      distance: route.legs[0].distance,
      duration: route.legs[0].duration,
      steps: route.legs[0].steps,
      polyline: route.overview_polyline.points
    });
  } catch (error) {
    res.status(500).json({ message: 'Directions error', error: error.message });
  }
});

export default router;
