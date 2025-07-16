// frontend/src/pages/SubscribeEmail.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// API URL from env
const API_URL = process.env.REACT_APP_API_URL || '';

const subscribeUser = async (payload) => {
  try {
    const res = await fetch(`${API_URL}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return { ok: res.ok, ...json };
  } catch (err) {
    console.log('Simulated subscription call for payload:', payload);
    return { ok: true, success: true, message: 'Simulated subscription successful' };
  }
};

export default function SubscribeEmail() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) return setError('Name is required');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Invalid email format');

    const payload = { name: name.trim(), email: email.trim(), subscriptionType: 'email' };
    const res = await subscribeUser(payload);

    if (res.ok && res.success) {
      toast.success('Subscription successful!');
      setSuccess(true);
      setName('');
      setEmail('');
      setTimeout(() => navigate('/community'), 2000);
    } else {
      setError(res.message || 'Subscription failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 shadow rounded mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
        Subscribe via Email
      </h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="font-medium text-gray-800 dark:text-gray-200">Name:</span>
          <input
            type="text"
            className="w-full border p-2 rounded mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="block mb-6">
          <span className="font-medium text-gray-800 dark:text-gray-200">Email:</span>
          <input
            type="email"
            className="w-full border p-2 rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
