import React, { useState } from 'react';
import axios from 'axios';
import config from '../config/env';
import api from '../services/api'; // Import the configured api instance

const CsrfTest = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const addResult = (testName, success, message, details = {}) => {
    setResults(prev => [{
      testName,
      success,
      message,
      details,
      timestamp: new Date().toISOString()
    }, ...prev]);
  };

  const testWithoutCsrf = async () => {
    try {
      // Try to logout without CSRF token using raw axios
      await axios.post(`${config.BACKEND_URL}/api/logout`, {}, {
        withCredentials: true
      });
      addResult('Unprotected Request', false, 'Request succeeded when it should have failed');
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.error;
      if (status === 403 && message === 'Invalid CSRF token') {
        addResult('Unprotected Request', true, 'Correctly blocked request without CSRF token');
      } else {
        addResult('Unprotected Request', false, `Unexpected error: ${err.message}`);
      }
    }
  };

  const testWithCsrf = async () => {
    try {
      // Use our configured api instance which automatically handles CSRF
      const response = await api.post('/api/test-session', {
        testData: 'CSRF Test ' + new Date().toISOString()
      });
      
      addResult(
        'Protected Request', 
        true, 
        'Successfully made request with CSRF token',
        { 
          sessionId: response.data.id,
          testData: response.data.testData
        }
      );
    } catch (err) {
      addResult(
        'Protected Request', 
        false, 
        `Failed with CSRF token: ${err.message}`,
        { 
          status: err.response?.status,
          error: err.response?.data?.error
        }
      );
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
          onClick={testWithoutCsrf}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Test Without CSRF Token
        </button>
        
        <button 
          onClick={testWithCsrf}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Test With CSRF Token
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
                {Object.keys(result.details).length > 0 && (
                  <pre className="text-xs mt-1 bg-white bg-opacity-50 p-1 rounded">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
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