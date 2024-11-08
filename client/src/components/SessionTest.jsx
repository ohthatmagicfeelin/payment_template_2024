import React, { useState } from 'react';
import axios from 'axios';
import config from '../config/env';

const SessionTest = () => {
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);

  const testSession = async () => {
    try {
      const response = await axios.get(`${config.BACKEND_URL}/api/test-session`, {
        withCredentials: true
      });
      setSessionData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSessionData(null);
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-lg font-bold mb-4">Session Test</h2>
      <button 
        onClick={testSession}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Session
      </button>
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      {sessionData && (
        <pre className="mt-4 p-2 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(sessionData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default SessionTest; 