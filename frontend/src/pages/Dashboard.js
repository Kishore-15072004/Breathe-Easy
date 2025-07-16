// src/pages/Dashboard.js
import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import AqiGauge from '../components/AqiGauge';
import PollutantCard from '../components/PollutantCard';
import LiveMap from './LiveMap';
import ForecastChart from '../components/ForecastChart';
import { FaExclamationTriangle } from 'react-icons/fa';

// --- Indian AQI Breakpoints (all arrays length 8 → max AQI 500) ---
const AQI_BREAKPOINTS = {
  "PM2.5": {
    conc: [0, 30, 60, 90, 120, 250, 350, 430],
    aqi:  [0, 50, 100, 150, 200, 300, 400, 500],
  },
  "PM10": {
    conc: [0, 50, 100, 250, 350, 430, 500, 600],
    aqi:  [0, 50, 100, 150, 200, 300, 400, 500],
  },
  "NO2": {
    conc: [0, 40, 80, 180, 280, 400, 500, 600],
    aqi:  [0, 50, 100, 150, 200, 300, 400, 500],
  },
  "SO2": {
    conc: [0, 40, 80, 380, 800, 1600, 2100, 2620],
    aqi:  [0, 50, 100, 150, 200, 300, 400, 500],
  },
  "CO": {
    // breakpoints in ppm
    conc: [0, 1, 2, 10, 17, 34, 40, 50],
    aqi:  [0, 50, 100, 150, 200, 300, 400, 500],
  },
  "Ozone": {
    // breakpoints in ppb
    conc: [0, 50, 100, 168, 208, 748, 1000, 1200],
    aqi:  [0, 50, 100, 150, 200, 300, 400, 500],
  },
};

// Linear interpolation to compute sub‑index for one pollutant
const computePollutantAQI = (pollutant, rawValue) => {
  let C = Number(rawValue) || 0;

  // Convert CO from ppb → ppm
  if (pollutant === "CO") {
    C = C / 1000;
  }

  const { conc, aqi } = AQI_BREAKPOINTS[pollutant] || {};
  if (!conc) return 0;

  // If concentration exceeds highest breakpoint, clamp to max AQI
  if (C >= conc[conc.length - 1]) {
    return aqi[aqi.length - 1];
  }

  // Find correct segment for interpolation
  for (let i = 1; i < conc.length; i++) {
    if (C <= conc[i]) {
      const C_low  = conc[i - 1];
      const C_high = conc[i];
      const I_low  = aqi[i - 1];
      const I_high = aqi[i];
      // linear interpolate:
      return (
        I_low +
        ((C - C_low) * (I_high - I_low)) / (C_high - C_low)
      );
    }
  }

  return 0;
};

// Compute overall AQI (max of individual sub‑indices)
const computeOverallAQI = (pollutants) => {
  let overall = 0;
  const individualAQIs = {};

  for (const key in pollutants) {
    const subIndex = computePollutantAQI(key, pollutants[key]);
    individualAQIs[key] = subIndex;
    if (subIndex > overall) {
      overall = subIndex;
    }
  }

  return { overallAQI: overall, individualAQIs };
};

// Map overall AQI to category
const getCategory = (aqi) => {
  const v = Number(aqi);
  if (v <= 50)  return "Good";
  if (v <= 100) return "Moderate";
  if (v <= 150) return "Unhealthy for Sensitive Groups";
  if (v <= 200) return "Unhealthy";
  if (v <= 300) return "Very Unhealthy";
  return "Hazardous";
};

export default function Dashboard() {
  const { liveAqi, weather, location, forecastData } = useContext(DataContext);

  // Pull raw pollutant values from backend (or default to 0)
  const pv = liveAqi?.pollutants ?? {
    pm2_5: 0,
    pm10:  0,
    no2:   0,
    so2:   0,
    co:    0,
    o3:    0,
  };

  // Compute using Indian keys
  const { overallAQI, individualAQIs } = computeOverallAQI({
    "PM2.5": pv.pm2_5,
    "PM10":  pv.pm10,
    "NO2":   pv.no2,
    "SO2":   pv.so2,
    "CO":    pv.co,
    "Ozone": pv.o3,
  });

  const aqiValue = overallAQI.toFixed(1);
  const category = getCategory(aqiValue);

  return (
    <main className="page min-h-screen p-4 space-y-6 sm:p-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
          {location?.city || "Your City"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          Last Updated: {new Date().toLocaleTimeString()}
        </p>
      </header>

      {/* Alert if unhealthy */}
      {overallAQI > 150 && (
        <aside
          className="card flex items-center gap-3 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-600 p-3 sm:p-4 shadow-md animate-pulse"
          aria-live="assertive"
        >
          <FaExclamationTriangle size={24} color="#FF0000" />
          <div className="text-sm">
            <h2 className="font-semibold">High Pollution Alert</h2>
            <p>
              AQI is <strong>{aqiValue}</strong> ({category})
            </p>
          </div>
        </aside>
      )}

      {/* AQI Gauge & Pollutants */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Gauge */}
        <div className="card p-4 flex flex-col items-center">
          <AqiGauge value={aqiValue} category={category} />
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Air Quality Index
          </p>
        </div>

        {/* Pollutant Cards */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <PollutantCard
            title="PM2.5"
            value={pv.pm2_5}
            unit="µg/m³"
            trend="stable"
          />
          <PollutantCard
            title="PM10"
            value={pv.pm10}
            unit="µg/m³"
            trend="stable"
          />
          <PollutantCard
            title="NO2"
            value={pv.no2}
            unit="µg/m³"
            trend="stable"
          />
          <PollutantCard
            title="SO2"
            value={pv.so2}
            unit="µg/m³"
            trend="stable"
          />
          <PollutantCard
            title="CO"
            value={pv.co}
            unit="ppb"
            trend="stable"
          />
          <PollutantCard
            title="Ozone"
            value={pv.o3}
            unit="ppb"
            trend="stable"
          />
        </div>

        {/* Live Map */}
        <div className="col-span-1 lg:col-span-3 card overflow-hidden h-80 sm:h-96">
          <h3 className="p-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            Live Map
          </h3>
          <LiveMap userLocation={location} />
        </div>
      </section>

      {/* Forecast & Weather */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card p-4">
          <h3 className="text-lg font-semibold text-blue-500 dark:text-blue-300 mb-2">
            Forecast
          </h3>
          {forecastData?.length ? (
            <ForecastChart data={forecastData} />
          ) : (
            <p className="text-gray-500">Loading forecast…</p>
          )}
        </div>
        <div className="weather-box p-4 card">
          <h3 className="text-lg font-semibold text-blue-500 dark:text-blue-300 mb-3">
            Current Weather
          </h3>
          {weather ? (
            <ul className="space-y-1 text-lg">
              <li>🌡️ Temp: {weather.main.temp}°C</li>
              <li>💧 Humidity: {weather.main.humidity}%</li>
              <li>🌬️ Wind: {weather.wind.speed} m/s</li>
              <li>🌤️ {weather.weather[0].description}</li>
            </ul>
          ) : (
            <p className="text-gray-500">Loading…</p>
          )}
        </div>
      </section>
    </main>
  );
}
