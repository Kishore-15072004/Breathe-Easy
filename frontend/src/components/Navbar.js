// Ensure your public/index.html (or similar) contains: 
// <div id="portal-root"></div>
import React, { useContext, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaBell } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { DataContext } from '../context/DataContext';

// Portal component to render children outside of the current React DOM hierarchy.
// This helps avoid issues with CSS stacking contexts.
function AlertDropdownPortal({ children }) {
  const portalRoot = document.getElementById('portal-root');
  return portalRoot ? createPortal(children, portalRoot) : children;
}

function Navbar() {
  const { alertHistory, markAlertsAsSeen, clearAlerts } = useContext(DataContext);
  const [showAlerts, setShowAlerts] = useState(false);
  const dropdownRef = useRef(null);

  // Calculate the number of unseen alerts.
  const unseenAlertsCount = alertHistory.filter((alert) => !alert.seen).length;

  // Toggle the alerts dropdown while marking alerts as seen.
  const handleBellClick = () => {
    markAlertsAsSeen();
    setShowAlerts((prev) => !prev);
  };

  // Close the dropdown if the user clicks outside of it.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAlerts(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="relative flex items-center py-6 px-4 shadow-md backdrop-blur-lg bg-white/50 dark:bg-gray-800/30">
      {/* Centered Brand Name with an explicit z-index to stay above other elements */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 dark:text-blue-400 z-10">
        Breathe Easy
      </div>

      {/* Right side controls */}
      <div className="ml-auto flex items-center space-x-4 relative">
        <ThemeToggle />

        <div className="relative">
          {/* Bell Icon Button */}
          <button
            onClick={handleBellClick}
            className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 focus:outline-none"
            aria-label="Alerts"
          >
            <FaBell size={24} />
            {unseenAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping" />
            )}
          </button>

          {/* Render the alerts dropdown into a separate DOM node to avoid stacking conflicts */}
          {showAlerts && (
            <AlertDropdownPortal>
              <div
                ref={dropdownRef}
                className="
                  absolute right-0 mt-2
                  w-64 sm:w-80
                  bg-white dark:bg-gray-700
                  shadow-xl rounded-xl
                  transition ease-out duration-300
                  transform opacity-25 scale-100
                  animate-dropdown
                "
                style={{ willChange: 'transform, opacity', zIndex: 9999 }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Alerts
                    </h3>
                    <button
                      onClick={clearAlerts}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                      aria-label="Clear all alerts"
                    >
                      Clear All
                    </button>
                  </div>

                  {alertHistory.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-300 text-sm">No alerts.</p>
                  ) : (
                    <ul className="max-h-60 overflow-y-auto">
                      {alertHistory.map((alert, idx) => (
                        <li
                          key={idx}
                          className="mb-2 border-b border-gray-200 dark:border-gray-600 pb-2"
                        >
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(alert.date).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </AlertDropdownPortal>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
