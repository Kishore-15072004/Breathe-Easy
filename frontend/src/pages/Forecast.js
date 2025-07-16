import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import ForecastChart from '../components/ForecastChart';

export default function Forecast() {
  const { forecastData, location } = useContext(DataContext);

  // Ensure forecastData is always an array
  const safeForecastData = Array.isArray(forecastData) ? forecastData : [];

  // Compute summary of forecast data (AQI and temperature) dynamically
  const calculateSummary = () => {
    if (safeForecastData.length === 0) return null;
    const aqiValues = safeForecastData.map(d => d.aqi);
    const tempValues = safeForecastData.map(d => d.temp);
    const average = arr => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
    return {
      avgAqi: average(aqiValues),
      maxAqi: Math.max(...aqiValues),
      minAqi: Math.min(...aqiValues),
      avgTemp: average(tempValues),
      maxTemp: Math.max(...tempValues),
      minTemp: Math.min(...tempValues),
    };
  };

  const summary = calculateSummary();

  return (
    <div className="forecast-page p-6 min-h-screen space-y-6 card">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-blue-400">
          Forecast – {location?.city || 'Unknown Location'}
        </h1>
        <p className="text-gray-400 mt-2">Predicted Air Quality & Weather</p>
      </header>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg space-y-6">
        {safeForecastData.length > 0 ? (
          <>
            <ForecastChart data={safeForecastData} />
            {summary && (
              <div className="text-sm text-gray-700 dark:text-gray-200 space-y-2">
                <h2 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-300">
                  Forecast Summary
                </h2>
                <p>
                  <strong>Average AQI:</strong> {summary.avgAqi} |{' '}
                  <strong>Max AQI:</strong> {summary.maxAqi} |{' '}
                  <strong>Min AQI:</strong> {summary.minAqi}
                </p>
                <p>
                  <strong>Average Temp:</strong> {summary.avgTemp}°C |{' '}
                  <strong>Max Temp:</strong> {summary.maxTemp}°C |{' '}
                  <strong>Min Temp:</strong> {summary.minTemp}°C
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">Loading forecast data…</p>
        )}
      </div>

      <footer className="text-center text-xs text-gray-600 mt-10">
        Last Updated: {new Date().toLocaleString()} — Forecast data from backend model
      </footer>
    </div>
  );
}
