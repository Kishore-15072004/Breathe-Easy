// frontend/src/components/MapView.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Default marker icon for AQI stations (using Leaflet's default)
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Custom blue icon for the user's location
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function MapView({ userLocation }) {
  const [aqiData, setAqiData] = useState([]);

  // Debug: Log userLocation to verify we are receiving the data.
  useEffect(() => {
    console.log("MapView: userLocation received:", userLocation);
  }, [userLocation]);

  // Fetch live AQI data from a hypothetical API endpoint.
  useEffect(() => {
    const fetchAqiData = async () => {
      try {
        const response = await fetch('https://api.example.com/live-aqi'); // Replace this endpoint with your actual API.
        const data = await response.json();
        setAqiData(data);
      } catch (error) {
        console.error('Error fetching AQI data:', error);
      }
    };

    fetchAqiData();
    const interval = setInterval(fetchAqiData, 30000); // Refresh every 30 seconds.
    return () => clearInterval(interval);
  }, []);

  // Determine map center based on the user's location if provided.
  const center =
    userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number'
      ? [userLocation.latitude, userLocation.longitude]
      : [17.385044, 78.486671]; // Default center (Hyderabad)

  return (
    <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
      {/* Map Tile Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Render AQI station markers */}
      {aqiData.map((station, index) => (
        <Marker
          key={index}
          position={[station.latitude, station.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            <div>
              <h3>{station.name}</h3>
              <p>
                <strong>AQI:</strong> {station.aqi}
              </p>
              <p>
                <strong>Category:</strong> {station.category}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Render a blue marker for the user's location if valid */}
      {userLocation &&
        typeof userLocation.latitude === 'number' &&
        typeof userLocation.longitude === 'number' && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={blueIcon}>
            <Popup>
              <div>
                <h3>Your Location</h3>
                <p>{userLocation.city}</p>
              </div>
            </Popup>
          </Marker>
      )}
    </MapContainer>
  );
}

export default MapView;
