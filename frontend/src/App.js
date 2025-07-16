// frontend/src/App.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AlertNotifications from './components/AlertNotifications';
import BackgroundVideo from './components/BackgroundVideo';

import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';
import Forecast from './pages/Forecast';
import Prediction from './pages/Prediction';
import History from './pages/History';
import Alerts from './pages/Alerts';
import Learn from './pages/Learn';
import Community from './pages/Community';
import SubscribeEmail from './pages/SubscribeEmail';
import NotFound from './pages/NotFound';

import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';

import './index.css';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <DataProvider>
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Fullscreen background video */}
        <BackgroundVideo
          // Light and dark mode videos in public/images
          lightSrc="/images/light-mode.mp4"
          darkSrc="/images/dark-mode.mp4"
          overlayOpacity={0.3}
        />

        {/* Main application layout */}
        <div className="relative z-10 flex h-screen overflow-hidden">
          {/* Sidebar navigation */}
          <Sidebar isOpen={sidebarOpen} />

          {/* Sidebar toggle button */}
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded shadow-md"
          >
            {sidebarOpen ? '✖' : '☰'}
          </button>

          {/* Content area */}
          <div
            className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
              sidebarOpen ? 'ml-64' : 'ml-0'
            }`}
          >
            <Navbar />
            <AlertNotifications />

            <main className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/map" element={<LiveMap />} />
                <Route path="/forecast" element={<Forecast />} />
                <Route path="/predict" element={<Prediction />} />
                <Route path="/history" element={<History />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/community" element={<Community />} />
                <Route path="/subscribe-email" element={<SubscribeEmail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
