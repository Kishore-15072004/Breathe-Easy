// frontend/src/pages/Prediction.js
import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GaugeChart from 'react-gauge-chart';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

export default function Prediction() {
  const [formData, setFormData] = useState({
    RH: '',       // Relative Humidity
    WS: '',       // Wind Speed
    Temp: '',     // Temperature
    BP: '',       // Barometric Pressure
    duration: '0',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  // Check if device is very small
  const isVerySmall = width <= 400;
  const isExtraSmall = width <= 350;

  // Auto-clear confetti after 5s
  useEffect(() => {
    let timer;
    if (showConfetti) {
      timer = setTimeout(() => setShowConfetti(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [showConfetti]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          RH: parseFloat(formData.RH),
          WS: parseFloat(formData.WS),
          Temp: parseFloat(formData.Temp),
          BP: parseFloat(formData.BP),
          duration: parseInt(formData.duration, 10),
        }),
      });
      if (!res.ok) throw new Error('Network error occurred while predicting.');
      const data = await res.json();
      setPrediction(data);
      toast.success('Prediction received successfully!');
      if (data.computed_AQI < 50) setShowConfetti(true);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ RH: '', WS: '', Temp: '', BP: '', duration: '0' });
    setPrediction(null);
    setShowConfetti(false);
  };

  const handleDemo = () => {
    setFormData({ RH: '55', WS: '3.2', Temp: '28', BP: '760', duration: '1' });
    const demoData = {
      ensemble_absolute: { "PM2.5": 25, PM10: 30, NO2: 20, SO2: 15, CO: 1.2, Ozone: 40 },
      computed_AQI: 90.5,
      individual_AQI: { "PM2.5": 95, PM10: 85, NO2: 90, SO2: 70, CO: 65, Ozone: 80 },
    };
    setPrediction(demoData);
    toast.info('Demo values loaded.');
  };

  const forecastHours = parseInt(formData.duration, 10);

  return (
    <div
      style={{
        overflowX: 'auto',
        maxWidth: '100vw',
        WebkitOverflowScrolling: 'touch', // smooth scrolling on iOS
      }}
    >
      <div
        className={`relative card page bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl prediction-page animate-fadeIn ${
          isVerySmall ? 'p-2 sm:p-3' : 'p-4 sm:p-6 lg:p-8'
        }`}
      >
        {showConfetti && <Confetti width={width} height={height} />}

        {/* Title */}
        <h1
          className={`font-extrabold mb-3 sm:mb-6 text-center text-blue-600 dark:text-blue-400 ${
            isExtraSmall ? 'text-lg' : isVerySmall ? 'text-xl' : 'text-2xl sm:text-3xl'
          }`}
        >
          Predict Air Quality
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`grid gap-3 ${
            isVerySmall ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 md:gap-6'
          }`}
        >
          {/* Relative Humidity */}
          <div className="w-full">
            <label
              htmlFor="RH"
              className={`block mb-1 font-semibold text-gray-700 dark:text-gray-300 ${
                isExtraSmall ? 'text-xs' : 'text-sm sm:text-base'
              }`}
            >
              Relative Humidity (RH) [%]
            </label>
            <input
              id="RH"
              type="number"
              name="RH"
              value={formData.RH}
              onChange={handleChange}
              required
              placeholder={isExtraSmall ? 'RH %' : 'Enter Relative Humidity in %'}
              className={`w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                isExtraSmall ? 'p-2 text-sm' : 'p-2 sm:p-3'
              }`}
            />
          </div>

          {/* Wind Speed */}
          <div className="w-full">
            <label
              htmlFor="WS"
              className={`block mb-1 font-semibold text-gray-700 dark:text-gray-300 ${
                isExtraSmall ? 'text-xs' : 'text-sm sm:text-base'
              }`}
            >
              Wind Speed (WS) [m/s]
            </label>
            <input
              id="WS"
              type="number"
              name="WS"
              value={formData.WS}
              onChange={handleChange}
              required
              placeholder={isExtraSmall ? 'WS m/s' : 'Enter Wind Speed in m/s'}
              className={`w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                isExtraSmall ? 'p-2 text-sm' : 'p-2 sm:p-3'
              }`}
            />
          </div>

          {/* Temperature */}
          <div className="w-full">
            <label
              htmlFor="Temp"
              className={`block mb-1 font-semibold text-gray-700 dark:text-gray-300 ${
                isExtraSmall ? 'text-xs' : 'text-sm sm:text-base'
              }`}
            >
              Temperature (Temp) [°C]
            </label>
            <input
              id="Temp"
              type="number"
              name="Temp"
              value={formData.Temp}
              onChange={handleChange}
              required
              placeholder={isExtraSmall ? 'Temp °C' : 'Enter Temperature in °C'}
              className={`w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                isExtraSmall ? 'p-2 text-sm' : 'p-2 sm:p-3'
              }`}
            />
          </div>

          {/* Barometric Pressure */}
          <div className="w-full">
            <label
              htmlFor="BP"
              className={`block mb-1 font-semibold text-gray-700 dark:text-gray-300 ${
                isExtraSmall ? 'text-xs' : 'text-sm sm:text-base'
              }`}
            >
              Barometric Pressure (BP) [mmHg]
            </label>
            <input
              id="BP"
              type="number"
              name="BP"
              value={formData.BP}
              onChange={handleChange}
              required
              placeholder={isExtraSmall ? 'BP mmHg' : 'Enter Pressure in mmHg'}
              className={`w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                isExtraSmall ? 'p-2 text-sm' : 'p-2 sm:p-3'
              }`}
            />
          </div>

          {/* Forecast Duration */}
          <div className="w-full">
            <label
              htmlFor="duration"
              className={`block mb-1 font-semibold text-gray-700 dark:text-gray-300 ${
                isExtraSmall ? 'text-xs' : 'text-sm sm:text-base'
              }`}
            >
              Forecast Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={`w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                isExtraSmall ? 'p-2 text-sm' : 'p-2 sm:p-3'
              }`}
            >
              <option value="0">Current (Immediate)</option>
              <option value="1">Next 1 Hour</option>
              <option value="3">Next 3 Hours</option>
              <option value="6">Next 6 Hours</option>
              <option value="12">Next 12 Hours</option>
              <option value="24">Next 24 Hours</option>
            </select>
          </div>

          {/* Buttons */}
          <div
            className={`flex justify-center gap-2 mt-2 ${
              isVerySmall ? 'col-span-1 flex-col' : 'md:col-span-2 flex-col sm:flex-row gap-3 sm:mt-4'
            }`}
          >
            <button
              type="button"
              onClick={handleReset}
              className={`px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-bold transition ${
                isExtraSmall ? 'text-sm' : ''
              }`}
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleDemo}
              className={`px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-white font-bold transition ${
                isExtraSmall ? 'text-sm' : ''
              }`}
            >
              Demo
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold flex items-center justify-center gap-2 transition ${
                isExtraSmall ? 'text-sm' : ''
              }`}
            >
              {loading && <FaSpinner className="animate-spin" />}
              Predict
            </button>
          </div>
        </form>

        {/* Prediction Result */}
        {prediction && (
          <div className="mt-6 text-center">
            <h2
              className={`text-lg font-bold mb-3 text-gray-800 dark:text-gray-200 ${
                isVerySmall ? 'text-base' : 'text-xl'
              }`}
            >
              Prediction Result
            </h2>

            <GaugeChart
              id="aqi-gauge-chart"
              nrOfLevels={20}
              colors={['#5BE12C', '#F5CD19', '#EA4228']}
              arcWidth={0.3}
              percent={Math.min(prediction.computed_AQI / 500, 1)}
              textColor="#000"
              formatTextValue={() => `${prediction.computed_AQI.toFixed(1)} AQI`}
              needleColor="#464A4F"
              animate={true}
              animateDuration={1000}
              className="mx-auto"
              style={{ width: isVerySmall ? '280px' : '400px' }}
            />


            {/* Individual AQI breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 max-w-xl mx-auto">
              {Object.entries(prediction.individual_AQI).map(([pollutant, val]) => (
                <div
                  key={pollutant}
                  className="bg-gray-100 dark:bg-gray-800 rounded p-3 shadow-sm flex flex-col items-center"
                >
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {pollutant}
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {val.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>

            {/* Ensemble Absolute Pollutant Values */}
            {prediction.ensemble_absolute && (
              <div className="mt-5 max-w-xl mx-auto text-left">
                <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Pollutant Concentrations:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  {Object.entries(prediction.ensemble_absolute).map(([pollutant, val]) => (
                    <li key={pollutant}>
                      {pollutant}: {val.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
