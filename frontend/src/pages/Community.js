// frontend/src/pages/Community.js
import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { useNavigate } from 'react-router-dom'; // useNavigate replaces useHistory in v6

export default function Community() {
  const { historyData } = useContext(DataContext);
  const navigate = useNavigate();

  // Show most recent 5 alerts
  const pastAlerts = (historyData || [])
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Request Push Notification permission when the button is clicked.
  const enablePushNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          alert('Push notifications enabled. You will receive alerts when pollutant levels are high.');
          // Optionally, register your service worker for push notifications here.
        } else {
          alert('Push notifications permission not granted.');
        }
      });
    } else {
      alert('Browser notifications are not supported by your browser.');
    }
  };

  return (
    <div className="page bg-white/55 dark:bg-gray-800/50 rounded shadow p-6 space-y-6 card">
      <h1 className="text-4xl font-extrabold text-blue-400 text-center">
        Community & Notifications
      </h1>

      <section>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Past Alerts</h2>
        {pastAlerts.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
            {pastAlerts.map(({ date, aqi, category }, idx) => (
              <li key={idx}>
                {new Date(date).toLocaleDateString()}: AQI {aqi} ({category})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No past alerts available.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Educational Resources
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Learn more about what PM2.5 means, its health effects, and tips to reduce exposure.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Subscription Options
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            onClick={() => navigate('/subscribe-email')}
          >
            Subscribe via Email
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            onClick={enablePushNotifications}
          >
            Enable Push Notifications
          </button>
        </div>
      </section>
    </div>
  );
}
