// frontend/src/pages/History.js
import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';

export default function History() {
  const { historyData } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredData = (historyData || []).filter((entry) =>
    entry.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const compareValues = (key, order = 'asc') => {
    return function (a, b) {
      let varA, varB;
      if (key === 'date') {
        varA = new Date(a[key]);
        varB = new Date(b[key]);
      } else if (key === 'AQI' || key === 'PM2.5' || key === 'PM10' || key === 'NO2') {
        varA = Number(a[key]);
        varB = Number(b[key]);
      } else {
        varA = (a[key] || '').toString().toUpperCase();
        varB = (b[key] || '').toString().toUpperCase();
      }

      if (varA > varB) return order === 'asc' ? 1 : -1;
      if (varA < varB) return order === 'asc' ? -1 : 1;
      return 0;
    };
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedData = [...filteredData].sort(compareValues(sortField, sortOrder));

  return (
    <div className="history-page p-6 min-h-screen space-y-6 card">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-blue-400">History</h1>
        <p className="text-gray-700 dark:text-gray-200 mt-2">Past AQI Records</p>
      </header>

      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by city…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg hidden sm:block">
        <table className="w-full text-sm text-gray-700 dark:text-gray-200">
          <thead className="text-gray-700 dark:text-gray-200 border-b border-gray-700">
            <tr>
              <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort('date')}>
                Date {sortField === 'date' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort('city')}>
                City {sortField === 'city' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort('AQI')}>
                AQI {sortField === 'AQI' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort('PM2.5')}>
                PM2.5 {sortField === 'PM2.5' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort('PM10')}>
                PM10 {sortField === 'PM10' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort('NO2')}>
                NO2 {sortField === 'NO2' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((entry, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition">
                  <td className="py-2 px-4">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{entry.city}</td>
                  <td className="py-2 px-4">{entry.AQI || 'N/A'}</td>
                  <td className="py-2 px-4">{entry["PM2.5"] || 'N/A'}</td>
                  <td className="py-2 px-4">{entry.PM10 || 'N/A'}</td>
                  <td className="py-2 px-4">{entry.NO2 || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {sortedData.length > 0 ? (
          sortedData.map((entry, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-md text-sm text-gray-700 dark:text-gray-200"
            >
              <p><span className="font-semibold">Date:</span> {new Date(entry.date).toLocaleDateString()}</p>
              <p><span className="font-semibold">City:</span> {entry.city}</p>
              <p><span className="font-semibold">AQI:</span> {entry.AQI || 'N/A'}</p>
              <p><span className="font-semibold">PM2.5:</span> {entry["PM2.5"] || 'N/A'}</p>
              <p><span className="font-semibold">PM10:</span> {entry.PM10 || 'N/A'}</p>
              <p><span className="font-semibold">NO2:</span> {entry.NO2 || 'N/A'}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No matching records found.</p>
        )}
      </div>
    </div>
  );
}
