import React, { useEffect, useState } from 'react';

function ForecastChart({ data }) {
  // Detect preferred color scheme for axis/text colors.
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(media.matches);
    const handler = (e) => setIsDarkMode(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // Validate that forecast data exists.
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <p className="text-center text-gray-400">
        No forecast data available.
      </p>
    );
  }

  // Define the internal coordinate system dimensions.
  const width = 1000;  // Total chart width in pixels (coordinate system)
  const height = 500;  // Total chart height in pixels (coordinate system)
  const padding = 70;  // Padding for axes and labels within the coordinate system

  // Extra margin to be added around the coordinate system so that ticks and labels are not cut off.
  const extraMargin = 20;
  // The new viewBox expands the coordinate system by extraMargin on all sides.
  const viewBox = `${-extraMargin} ${-extraMargin} ${width + 2 * extraMargin} ${height + 2 * extraMargin}`;

  // Determine the maximum AQI value from the data for y-axis scaling.
  const maxAqi = Math.max(...data.map(d => d.aqi), 1);
  // Choose an axis/text color based on the theme.
  const axisColor = isDarkMode ? '#444' : '#000';

  // Compute polyline points for the AQI data.
  const aqiPoints = data
    .map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      // Higher AQI appears toward the top.
      const y = height - padding - (d.aqi / maxAqi) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  // Generate Y-axis tick marks: divide the y-axis into 5 equal parts.
  const yTickCount = 5;
  const yTicks = [];
  for (let i = 0; i <= yTickCount; i++) {
    const value = (maxAqi / yTickCount) * i;
    const y = height - padding - (value / maxAqi) * (height - 2 * padding);
    yTicks.push({ value: Math.round(value), y });
  }

  /* 
    For the X-axis:
      - Assume each data point represents 1 hour.
      - Total forecast duration in hours = data.length.
      - Total units (each unit = 4 hours) = data.length / 4.
      - To avoid overcrowding, if there are more than 6 4‑hour units, only show every xTickInterval‑th tick.
  */
  const totalHours = data.length;
  const totalUnits = totalHours / 4;
  const maxXTicks = 6;
  const xTickInterval = totalUnits > maxXTicks ? Math.ceil(totalUnits / maxXTicks) : 1;

  const xTicks = [];
  for (let tick = 0; tick <= totalUnits; tick += xTickInterval) {
    const index = Math.min(Math.round(tick * 4), data.length - 1);
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    xTicks.push({ label: data[index].time, x });
  }

  return (
    <svg
      width="100%"
      height="90%"
      viewBox={viewBox}
      // Stretch the viewBox so that the contents fill the container exactly,
      // preserving the extraMargin we added.
      preserveAspectRatio="none"
      className="block"
      
    >
      {/* Y-axis */}
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke={axisColor}
        strokeWidth="2"
      />
      {/* X-axis */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke={axisColor}
        strokeWidth="2"
      />

      {/* Y-axis tick marks and labels */}
      {yTicks.map((tick, i) => (
        <g key={`y-tick-${i}`}>
          <line
            x1={padding - 5}
            y1={tick.y}
            x2={padding}
            y2={tick.y}
            stroke={axisColor}
            strokeWidth="1.5"
          />
          <text
            x={padding - 10}
            y={tick.y + 4}
            textAnchor="end"
            fontSize="12"
            fill={axisColor}
          >
            {tick.value}
          </text>
        </g>
      ))}

      {/* AQI polyline */}
      <polyline
        points={aqiPoints}
        fill="none"
        stroke="#FF7E00"
        strokeWidth="3"
      />

      {/* X-axis tick labels */}
      {xTicks.map((tick, i) => (
        <text
          key={`x-tick-${i}`}
          x={tick.x}
          y={height - padding + 20}
          fontSize="12"
          fill={axisColor}
          textAnchor="middle"
        >
          {tick.label}
        </text>
      ))}

      {/* X-axis scale information (centered) */}
      <text
        x={width / 2}
        y={height - 10}
        fontSize="12"
        fill={axisColor}
        textAnchor="middle"
      >
        X-axis Scale: 1 unit = 4 hours
      </text>

      {/* Y-axis scale information (rotated left) */}
      <text
        x={25}
        y={height / 2}
        fontSize="12"
        fill={axisColor}
        textAnchor="middle"
        transform={`rotate(-90,25,${height / 2})`}
      >
        Y-axis Scale: Each tick = {(maxAqi / yTickCount).toFixed(0)} AQI
      </text>
    </svg>
  );
}

export default ForecastChart;
