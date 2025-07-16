// src/context/DataContext.js
import React, { createContext, useState, useEffect } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [liveAqi, setLiveAqi] = useState(null);
  const [pollutants, setPollutants] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [location, setLocation] = useState({ city: '', lat: null, lon: null });
  const [weather, setWeather] = useState(null);

  // Load alertHistory from localStorage on initial mount
  const [alertHistory, setAlertHistory] = useState(() => {
    const storedAlerts = localStorage.getItem('alertHistory');
    return storedAlerts ? JSON.parse(storedAlerts) : [];
  });

  // Helper function to record an alert (alerts are marked unseen by default)
  const addAlert = (alert) => {
    setAlertHistory((prev) => [{ ...alert, seen: false }, ...prev]);
  };

  // Helper to mark all alerts as seen
  const markAlertsAsSeen = () => {
    setAlertHistory((prev) =>
      prev.map((alert) => ({ ...alert, seen: true }))
    );
  };

  // New helper to clear all alerts
  const clearAlerts = () => {
    setAlertHistory([]);
    localStorage.removeItem('alertHistory');
  };

  useEffect(() => {
    window.addAlert = addAlert;
  }, [addAlert]);

  // Persist alertHistory to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem('alertHistory', JSON.stringify(alertHistory));
  }, [alertHistory]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

  // Fetch live AQI data & extract pollutants from the response
  useEffect(() => {
    fetch(`${API_URL}/live-aqi`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setLiveAqi(data);
          // Assuming the API returns a "pollutants" key.
          setPollutants(data.pollutants);
          setLocation({
            city: data.city || '',
            lat: data.lat,
            lon: data.lon,
          });
        } else {
          console.error('Live AQI error:', data.error);
        }
      })
      .catch((err) => console.error('Error fetching live-aqi:', err));
  }, [API_URL]);

  // Fetch forecast AQI data
  useEffect(() => {
    fetch(`${API_URL}/forecast-aqi`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          const updatedData = data.map((item) => ({
            ...item,
            // If temperature data isn't available, simulate it.
            temp:
              item.temp !== undefined
                ? item.temp
                : Math.round(Math.random() * 15 + 20),
          }));
          setForecastData(updatedData);
        } else {
          console.error('Forecast AQI error:', data.error);
        }
      })
      .catch((err) => console.error('Error fetching forecast-aqi:', err));
  }, [API_URL]);

  // Fetch historical AQI data
  useEffect(() => {
    fetch(`${API_URL}/history-aqi`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setHistoryData(data);
        } else {
          console.error('History AQI error:', data.error);
        }
      })
      .catch((err) => console.error('Error fetching history-aqi:', err));
  }, [API_URL]);

  // Fetch current weather data once location is available.
  useEffect(() => {
    if (location.lat && location.lon) {
      const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`
      )
        .then((response) => response.json())
        .then((data) => setWeather(data))
        .catch((err) =>
          console.error('Error fetching current weather:', err)
        );
    }
  }, [location]);

  return (
    <DataContext.Provider
      value={{
        liveAqi,
        pollutants,
        forecastData,
        historyData,
        location,
        weather,
        alertHistory,
        addAlert,
        markAlertsAsSeen,
        clearAlerts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
