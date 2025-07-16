// frontend/src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      <FaExclamationTriangle className="text-yellow-500 mb-4" size={60} />
      <h1 className="text-5xl font-extrabold mb-4">404</h1>
      <p className="text-lg mb-6">Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold transition">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
