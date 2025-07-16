// frontend/src/components/AlertNotifications.js
import React, { useEffect, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import { DataContext } from '../context/DataContext';

/**
 * Normalize pollutant keys by removing underscores and periods,
 * then converting to lowercase.
 * For example, "PM2.5" and "pm2_5" become "pm25".
 */
function normalizeKey(key) {
  return key.replace(/[_\.]/g, '').toLowerCase();
}

export default function AlertNotifications() {
  const { pollutants, addAlert } = useContext(DataContext);
  // Ref to store the timestamp of the last notification per pollutant
  const lastNotifiedRef = useRef({});

  // Pollutant alert effect: check for high pollutant values when pollutants change.
  useEffect(() => {
    if (!pollutants) return;

    // Default thresholds (using normalized keys)
    const defaultThresholds = {
      pm25: 40,
      pm10: 70,
      no2: 20,
      so2: 35,
      co: 1000,    // Adjust threshold as needed
      ozone: 100,
    };

    // Retrieve thresholds from localStorage or fallback to defaults.
    const storedThresholds =
      JSON.parse(localStorage.getItem('alertThresholds')) || defaultThresholds;
    const thresholds = storedThresholds;

    const now = Date.now();
    // Define a cooldown period to avoid sending the same alert too frequently.
    const POLLUTANT_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds

    Object.entries(thresholds).forEach(([normKey, threshold]) => {
      // Find a pollutant that matches the normalized key.
      const matchedEntry = Object.entries(pollutants).find(
        ([originalKey]) => normalizeKey(originalKey) === normKey
      );

      if (matchedEntry) {
        const [originalKey, value] = matchedEntry;
        const numericValue = parseFloat(value);
        // Get the last notification time (or default to 0)
        const lastNotified = lastNotifiedRef.current[normKey] || 0;

        if (
          !isNaN(numericValue) &&
          numericValue > threshold &&
          now - lastNotified > POLLUTANT_COOLDOWN
        ) {
          const message = `${originalKey.toUpperCase()} is high: ${numericValue}`;

          // Trigger an in-app toast error message.
          toast.error(message, {
            position: 'top-right',
            autoClose: 5000,
            pauseOnHover: true,
          });

          // Trigger a browser notification if permission is granted.
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Alert: ${originalKey.toUpperCase()}`, { body: message });
          }

          // Record the alert.
          const alertRecord = {
            pollutant: originalKey.toUpperCase(),
            value: numericValue,
            message,
            date: new Date().toISOString(),
          };
          addAlert(alertRecord);
          // Inside your useEffect, right after addAlert(alertRecord);
          fetch(`${process.env.REACT_APP_API_URL}/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alertRecord),
          })
            .then(res => {
              if (!res.ok) console.error('Notify endpoint error');
            })
            .catch(err => console.error('Error calling /notify:', err));
          // Update the last notification timestamp for this pollutant.
          lastNotifiedRef.current[normKey] = now;
        }
      }
    });
  }, [pollutants, addAlert]);

  // Basic periodic notifications effect: send a basic notification every 6-7 hours.
  useEffect(() => {
    let timeoutId;

    const basicMessages = [
      "Remember to check the air quality before stepping out!",
      "Keep yourself updated on today's air quality.",
      "Tip: Closing your windows can help when outdoor pollution is high.",
      "Stay informed: monitor the air quality for a healthier day.",
      "Quick reminder: proper ventilation can improve indoor air quality!",
      "Breathe easy—check your local air quality news periodically.",
    ];

    function runBasicNotification() {
      const randomIndex = Math.floor(Math.random() * basicMessages.length);
      const message = basicMessages[randomIndex];

      // Show an in-app info toast.
      toast.info(message, {
        position: 'top-right',
        autoClose: 5000,
        pauseOnHover: true,
      });

      // Trigger a native browser notification if permitted.
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("Air Quality Update", { body: message });
      }
    }

    function scheduleNextNotification() {
      const minInterval = 6 * 60 * 60 * 1000; // 6 hours
      const maxInterval = 7 * 60 * 60 * 1000; // 7 hours
      const delay = Math.random() * (maxInterval - minInterval) + minInterval;
      timeoutId = setTimeout(() => {
        runBasicNotification();
        scheduleNextNotification();
      }, delay);
    }

    scheduleNextNotification();

    // Cleanup on unmount: cancel the pending timer.
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
