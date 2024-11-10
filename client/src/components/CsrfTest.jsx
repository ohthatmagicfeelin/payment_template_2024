import React, { useState } from 'react';
import axios from 'axios';
import config from '../config/env';

const CsrfTest = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const addResult = (testName, success, message) => {
    setResults(prev => [...prev, {
      testName,
      success,
      message,
      timestamp: new Date().toISOString()
    }]);
  };

  const testProtectedRoute = async () => {
    try {
      // Try to logout without CSRF token
      await axios.post(`${config.BACKEND_URL}/api/logout`, {}, {
        withCredentials: true
      });
      addResult('Protected Route', false, 'Request succeeded when it should have failed');
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.error;
      if (status === 403 && message === 'Invalid CSRF token') {
        addResult('Protected Route', true, 'Correctly blocked request without CSRF token');
      } else {
        addResult('Protected Route', false, `Unexpected error: ${err.message}`);
      }
    }
  };

  const testUnprotectedRoute = async () => {
    try {
      // Test session endpoint (which doesn't require CSRF)
      const response = await axios.get(`${config.BACKEND_URL}/api/test-session`, {
        withCredentials: true
      });
      addResult('Unprotected Route', true, 'Successfully accessed unprotected route');
    } catch (err) {
      addResult('Unprotected Route', false, `Failed to access unprotected route: ${err.message}`);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-lg font-bold mb-4">CSRF Protection Test</h2>
      
      <div className="space-x-2 mb-4">
        <button 
          onClick={testProtectedRoute}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Protected Route
        </button>
        
        <button 
          onClick={testUnprotectedRoute}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Test Unprotected Route
        </button>
        
        <button 
          onClick={clearResults}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-2 rounded ${
                  result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                <div className="font-medium">{result.testName}</div>
                <div className="text-sm">{result.message}</div>
                <div className="text-xs opacity-75">{result.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CsrfTest; 