// src/components/PollutantCard.js
import React from 'react';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

// Helper to map display names to API keys.
const mapPollutantKey = (pollutant) => {
  const mapping = {
    "PM2.5": "pm2_5",
    "PM10": "pm10",
    "NO2": "no2",
    "SO2": "so2",
    "CO": "co",
    "Ozone": "o3"
  };
  return mapping[pollutant] || pollutant.toLowerCase();
};

// Default descriptions for common pollutants.
const defaultDescriptions = {
  "PM2.5": "Fine particulate matter smaller than 2.5μm that can penetrate deep into the lungs, posing serious health risks.",
  "PM10": "Particulate matter with a diameter of 10μm or less that can be inhaled and affect respiratory health.",
  "NO2": "Nitrogen dioxide produced by combustion processes such as traffic and industry that can irritate the respiratory system.",
  "SO2": "Sulfur dioxide, largely emitted by burning fossil fuels, which can cause respiratory irritation.",
  "CO": "Carbon monoxide, a colorless and odorless gas, which is harmful when inhaled because it reduces oxygen delivery in the body.",
  "Ozone": "Ground-level ozone formed by reactions of other pollutants under sunlight, which can adversely affect lung function."
};

function PollutantCard({ title, value, unit, trend, color, description, chartData }) {
  // Use provided description or fallback to the default.
  const finalDescription = description || defaultDescriptions[title] || '';

  const renderTrendIcon = () => {
    if (trend === 'up') return <FaArrowUp style={{ color: "#FF0000" }} />;
    if (trend === 'down') return <FaArrowDown style={{ color: "#00FF00" }} />;
    return <FaMinus className="text-gray-500" />;
  };

  const renderMiniChart = () => {
    if (!chartData || chartData.length === 0) return null;
    const height = 30, width = 70, max = Math.max(...chartData);
    const points = chartData
      .map((pt, i) => `${(i / (chartData.length - 1)) * width},${height - (pt / max) * height}`)
      .join(' ');
    return (
      <svg width={width} height={height} className="mt-2">
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
      </svg>
    );
  };

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-bold">{title}</h3>
        {renderTrendIcon()}
      </div>
      <div className="flex items-baseline">
        {/* Format the value to one decimal place */}
        <span className="text-3xl font-bold">{Number(value).toFixed(1)}</span>
        <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{unit}</span>
      </div>
      {finalDescription && (
        <p className="text-sm text-gray-800 dark:text-gray-400 mt-1">
          {finalDescription}
        </p>
      )}
      {renderMiniChart()}
    </div>
  );
}

export default PollutantCard;
