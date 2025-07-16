// src/pages/Alerts.js
import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../context/DataContext';
import { FaBell, FaExclamationTriangle } from 'react-icons/fa';
import precautionTips from '../data/precautionTips.json';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Normalizes pollutant keys by removing underscores and periods
 * and converting to lowercase – for example, "PM2.5" or "pm2_5" become "pm25".
 */
function normalizeKey(key) {
  return key.replace(/[_\.]/g, '').toLowerCase();
}

/**
 * Returns a random subset of precaution tips for a given pollutant.
 */
function getRandomTips(pollutant, count = 3) {
  const normalized = normalizeKey(pollutant);
  const tips = precautionTips[normalized] || [];
  return [...tips].sort(() => Math.random() - 0.5).slice(0, count);
}

export default function Alerts() {
  const { pollutants } = useContext(DataContext);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!pollutants) {
      setAlerts([]);
      return;
    }

    const thresholds = {
      pm25: 40,
      pm10: 70,
      no2: 20,
      so2: 35,
      co: 1000,
      ozone: 100,
    };

    const detected = Object.entries(pollutants)
      .filter(([key, value]) => {
        const normKey = normalizeKey(key);
        const numericValue = Number(value);
        return thresholds[normKey] !== undefined && numericValue > thresholds[normKey];
      })
      .map(([key, value]) => ({
        pollutant: key,
        value,
        tips: getRandomTips(key),
      }));

    setAlerts(detected);
  }, [pollutants]);

  return (
    <div className="alerts-page p-6 min-h-screen space-y-6">
      <header className="text-center">
        <motion.h1 
          className="text-4xl font-extrabold text-blue-400"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Alerts
        </motion.h1>
        <motion.p 
          className="text-gray-900 dark:text-gray-400 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Real-Time Warnings and Precaution Tips
        </motion.p>
      </header>

      <AnimatePresence>
        {alerts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                className="bg-red-500/20 backdrop-blur-md rounded-2xl p-6 shadow-lg space-y-3 hover:scale-[1.015] transition-transform"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div className="flex items-center space-x-3">
                  <FaExclamationTriangle
                    className="text-red-700 dark:text-red-400"
                    size={28}
                  />
                  <div>
                    <h2 className="text-xl font-bold text-red-700 dark:text-red-300">
                      {alert.pollutant.toUpperCase()} Alert
                    </h2>
                    <p className="dark:text-white">
                      {alert.pollutant.toUpperCase()} level is high: {alert.value}
                    </p>
                  </div>
                </div>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-800 dark:text-gray-200">
                  {alert.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center space-y-4 mt-10 p-6 bg-green-100 dark:bg-green-800/20 rounded-2xl shadow-lg "  
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaBell className="text-green-400 animate-bounce" size={50} />
            <p className="text-black dark:text-gray-300 text-xl">
              All clear! No pollution alerts right now ✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}