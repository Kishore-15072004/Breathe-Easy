import React from 'react';

function AqiGauge({ value, category }) {
  // Increase the gauge radius
  const radius = 80; // Updated from 60 to 80
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * radius;

  // Calculate the strokeDasharray based on the current value.
  // The gauge only shows 75% of a full circle (i.e. an arc), so we scale the circumference.
  const calculateArcLength = () => {
    const pct = Math.min(value / 500, 1);
    return pct * circumference * 0.75;
  };

  // Get the color based on AQI thresholds
  const getAqiColor = () => {
    if (value <= 50) return "#00E400";
    if (value <= 100) return "#FFFF00";
    if (value <= 150) return "#FF7E00";
    if (value <= 200) return "#FF0000";
    if (value <= 300) return "#8F3F97";
    return "#7E0023";
  };

  return (
    <div className="relative flex flex-col items-center w-full max-w-[280px] mx-auto">
      <svg viewBox="0 0 180 180" className="w-full h-auto">
        {/* Background circle (full arc) */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#ccc"
          strokeWidth="10"
        />
        {/* Foreground arc representing AQI */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={getAqiColor()}
          strokeWidth="10"
          strokeDasharray={`${calculateArcLength()} ${circumference}`}
          strokeLinecap="round"
          // Rotate so that the arc starts from the desired angle (about -135°)
          transform={`rotate(-135 ${cx} ${cy})`}
        />
        {/* Center text displaying the numeric AQI value */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          className="aqi-value fill-current font-extrabold"
          fontSize="26"
        >
          {value}
        </text>
      </svg>
      {/* Category text below the gauge */}
      <div
        className="text-sm sm:text-base mt-2 font-medium text-center"
        style={{ color: getAqiColor() }}
      >
        {category}
      </div>
    </div>
  );
}

export default AqiGauge;
