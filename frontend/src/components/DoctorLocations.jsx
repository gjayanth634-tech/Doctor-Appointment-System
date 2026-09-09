import { useEffect, useState } from 'react';
import { locationAPI } from '../api/locationAndVideoAPI';

// Component for showing nearby doctors and clinic locations
export default function DoctorLocations() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default
  const [searchType, setSearchType] = useState('hospital');

  // Get user's current location
  const getUserLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          searchNearbyDoctors(latitude, longitude);
        },
        (err) => {
          setError('Unable to get location: ' + err.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported');
      setLoading(false);
    }
  };

  // Search for nearby doctors/clinics
  const searchNearbyDoctors = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await locationAPI.findNearby(lat, lng, searchRadius, searchType);
      setNearbyPlaces(response.data.places || []);
      setError(null);
    } catch (err) {
      setError('Failed to search nearby locations');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance to a place
  const calculateDistanceToPlace = async (place) => {
    try {
      if (!userLocation) return;
      const response = await locationAPI.calculateDistance(
        userLocation,
        { lat: place.lat, lng: place.lng }
      );
      return response.data.distance.text;
    } catch (err) {
      console.error('Distance calculation error:', err);
      return 'N/A';
    }
  };

  // Get detailed information about a place
  const getPlaceDetails = async (place) => {
    try {
      const response = await locationAPI.getPlaceDetails(place.id);
      setSelectedPlace(response.data);
    } catch (err) {
      setError('Failed to get place details');
      console.error('Place details error:', err);
    }
  };

  // Get directions to a place
  const getDirections = async (place) => {
    try {
      if (!userLocation) return;
      const response = await locationAPI.getDirections(
        userLocation,
        { lat: place.lat, lng: place.lng },
        'driving'
      );
      // Open Google Maps in a new tab
      const mapsUrl = `https://maps.google.com/?saddr=${userLocation.lat},${userLocation.lng}&daddr=${place.lat},${place.lng}`;
      window.open(mapsUrl, '_blank');
    } catch (err) {
      setError('Failed to get directions');
      console.error('Directions error:', err);
    }
  };

  // Search doctors on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Refresh search when radius or type changes
  const handleSearchChange = () => {
    if (userLocation) {
      searchNearbyDoctors(userLocation.lat, userLocation.lng);
    }
  };

  return (
    <div className="doctor-locations-container">
      <style jsx>{`
        .doctor-locations-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          background: #f5f5f5;
          min-height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
          margin: 0;
          color: #333;
          font-size: 24px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          background: #007bff;
          color: white;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.3s;
        }

        .btn:hover {
          background: #0056b3;
        }

        .btn.secondary {
          background: #6c757d;
        }

        .btn.secondary:hover {
          background: #5a6268;
        }

        .filters {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          background: white;
          padding: 15px;
          border-radius: 8px;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .filter-group label {
          font-size: 12px;
          font-weight: bold;
          color: #666;
          text-transform: uppercase;
        }

        .filter-group select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 20px;
        }

        .sidebar {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          height: fit-content;
          max-height: 600px;
          overflow-y: auto;
        }

        .user-location-info {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .location-badge {
          display: inline-block;
          background: #e7f3ff;
          color: #0066cc;
          padding: 5px 10px;
          border-radius: 3px;
          font-size: 12px;
          margin-top: 5px;
        }

        .places-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .place-item {
          padding: 12px;
          background: #f9f9f9;
          border: 2px solid #eee;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .place-item:hover {
          border-color: #007bff;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
        }

        .place-item.active {
          border-color: #007bff;
          background: #e7f3ff;
        }

        .place-name {
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .place-rating {
          color: #ff9800;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .place-distance {
          color: #666;
          font-size: 12px;
        }

        .map-section {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .map-placeholder {
          width: 100%;
          height: 400px;
          background: #e0e0e0;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .place-details {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .place-details h3 {
          margin-top: 0;
          color: #333;
        }

        .detail-item {
          margin: 10px 0;
          color: #666;
          font-size: 14px;
        }

        .detail-label {
          font-weight: bold;
          color: #333;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .action-buttons .btn {
          flex: 1;
          padding: 8px 12px;
          font-size: 12px;
        }

        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .error {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .content {
            grid-template-columns: 1fr;
          }

          .header {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
        }
      `}</style>

      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1>🏥 Find Nearby Doctors & Clinics</h1>
        </div>
        <div className="header-actions">
          <button className="btn" onClick={getUserLocation}>
            📍 Get My Location
          </button>
        </div>
      </div>

      {error && <div className="error">⚠️ {error}</div>}

      <div className="filters">
        <div className="filter-group">
          <label>Search Type</label>
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              handleSearchChange();
            }}
          >
            <option value="hospital">Hospital</option>
            <option value="doctor">Doctor's Office</option>
            <option value="clinic">Clinic</option>
            <option value="dentist">Dentist</option>
            <option value="pharmacy">Pharmacy</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search Radius (meters)</label>
          <select
            value={searchRadius}
            onChange={(e) => {
              setSearchRadius(Number(e.target.value));
              handleSearchChange();
            }}
          >
            <option value={1000}>1 km</option>
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={25000}>25 km</option>
            <option value={50000}>50 km</option>
          </select>
        </div>
      </div>

      <div className="content">
        <div className="sidebar">
          {userLocation && (
            <div className="user-location-info">
              <p>
                <strong>📍 Your Location</strong>
                <div className="location-badge">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </div>
              </p>
            </div>
          )}

          {loading ? (
            <div className="loading">Loading nearby locations...</div>
          ) : nearbyPlaces.length > 0 ? (
            <div className="places-list">
              {nearbyPlaces.map((place) => (
                <div
                  key={place.id}
                  className={`place-item ${selectedPlace?.id === place.id ? 'active' : ''}`}
                  onClick={() => getPlaceDetails(place)}
                >
                  <div className="place-name">{place.name}</div>
                  {place.rating && (
                    <div className="place-rating">
                      ⭐ {place.rating} • {place.address}
                    </div>
                  )}
                  {place.distance && (
                    <div className="place-distance">📍 {place.distance}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="loading">No places found. Try adjusting your search.</div>
          )}
        </div>

        <div className="map-section">
          <div className="map-placeholder">
            📺 Map View (Integrate Google Maps or Leaflet here)
          </div>

          {selectedPlace && (
            <div className="place-details">
              <h3>{selectedPlace.name}</h3>

              <div className="detail-item">
                <span className="detail-label">📍 Address:</span>
                <br />
                {selectedPlace.address}
              </div>

              {selectedPlace.phone && (
                <div className="detail-item">
                  <span className="detail-label">📞 Phone:</span>
                  <br />
                  <a href={`tel:${selectedPlace.phone}`}>{selectedPlace.phone}</a>
                </div>
              )}

              {selectedPlace.website && (
                <div className="detail-item">
                  <span className="detail-label">🌐 Website:</span>
                  <br />
                  <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer">
                    {selectedPlace.website}
                  </a>
                </div>
              )}

              {selectedPlace.hours && (
                <div className="detail-item">
                  <span className="detail-label">⏰ Hours:</span>
                  <br />
                  {Array.isArray(selectedPlace.hours.weekday_text)
                    ? selectedPlace.hours.weekday_text.join(' | ')
                    : 'Hours not available'}
                </div>
              )}

              <div className="action-buttons">
                <button
                  className="btn"
                  onClick={() => getDirections(selectedPlace)}
                >
                  🗺️ Directions
                </button>
                <button className="btn secondary">
                  📞 Call
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
