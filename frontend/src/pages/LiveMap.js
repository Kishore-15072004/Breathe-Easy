import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to recenter the map when the position updates
function Recenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [position, map]);

  return null;
}

export default function LiveMap() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const watcherRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.');
      return;
    }

    // Quick low-accuracy seed for initial map view
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition([coords.latitude, coords.longitude]);
      },
      () => {
        // Ignore initial errors
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );

    // High-accuracy updates with longer timeout
    watcherRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        setPosition([coords.latitude, coords.longitude]);
      },
      (err) => {
        console.error('Geolocation error', err);
        setError(`Error (${err.code}): ${err.message}`);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 60000 }
    );

    return () => {
      if (watcherRef.current != null) {
        navigator.geolocation.clearWatch(watcherRef.current);
      }
    };
  }, []);

  if (error) {
    return (
      <p className="text-center text-red-500 mt-10">
        {error}
      </p>
    );
  }

  if (!position) {
    return (
      <p className="text-center mt-10">
        Fetching location…
      </p>
    );
  }

  const RADIUS = 2800; // in meters

  return (
    <div className="live-map-page p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-4">
        Live Location Tracker
      </h1>

      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom
        style={{ height: '80vh', width: '100%' }}
      >
        <Recenter position={position} />

        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            <div className="text-sm">
              <strong>You are here</strong>
              <div>Lat: {position[0].toFixed(6)}</div>
              <div>Lng: {position[1].toFixed(6)}</div>
            </div>
          </Popup>
        </Marker>

        <Circle
          center={position}
          radius={RADIUS}
          pathOptions={{ color: 'blue', fillOpacity: 0.1 }}
        />
      </MapContainer>

      <p className="text-center mt-2 text-sm text-gray-600">
        Circle radius: {RADIUS} meters
      </p>
    </div>
  );
}