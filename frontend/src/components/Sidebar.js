// frontend/src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaMapMarkedAlt,
  FaChartLine,
  FaMagic,
  FaHistory,
  FaBell,
  FaBookOpen,
  FaUsers,
} from 'react-icons/fa';

function Sidebar({ isOpen }) {
  const navItems = [
    { to: '/', icon: FaHome, label: 'Dashboard' },
    { to: '/map', icon: FaMapMarkedAlt, label: 'Live Map' },
    { to: '/forecast', icon: FaChartLine, label: 'Forecast' },
    { to: '/predict', icon: FaMagic, label: 'Predict' },           // Changed to FaMagic for prediction
    { to: '/history', icon: FaHistory, label: 'History' },
    { to: '/alerts', icon: FaBell, label: 'Alerts' },
    { to: '/learn', icon: FaBookOpen, label: 'Learn' },            // Changed to FaBookOpen for learning
    { to: '/community', icon: FaUsers, label: 'Community' },       // Changed to FaUsers for community
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 h-full w-64 z-50
        transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-white/40 dark:bg-gray-900/20 backdrop-blur-lg border-r border-gray-300 dark:border-gray-800
      `}
    >
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 mt-10">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-500 text-white border-l-4 border-blue-700'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`
                }
              >
                <Icon className="mr-3 text-lg" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
