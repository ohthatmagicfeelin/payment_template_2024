import React, { useState } from 'react';
import axios from 'axios';
import config from '../config/env';
import api from '../services/api';

const SecurityTest = () => {
  const [results, setResults] = useState([]);

  const addResult = (testName, success, message, details = {}) => {
    setResults(prev => [{
      testName,
      success,
      message,
      details,
      timestamp: new Date().toISOString()
    }, ...prev]);
  };

  // Test getting CSRF token
  const testGetCsrfToken = async () => {
    try {
      const response = await axios.get(`${config.BACKEND_URL}/api/csrf-token`, {
        withCredentials: true
      });
      addResult(
        'Get CSRF Token',
        true,
        'Successfully retrieved CSRF token',
        { token: response.data.csrfToken }
      );
    } catch (err) {
      addResult('Get CSRF Token', false, `Failed to get CSRF token: ${err.message}`);
    }
  };

  // Test protected route without CSRF
  const testProtectedWithoutCsrf = async () => {
    try {
      await axios.post(`${config.BACKEND_URL}/api/logout`, {}, {
        withCredentials: true
      });
      addResult('Protected Without CSRF', false, 'Request succeeded when it should have failed');
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.error;
      if (status === 403 && message === 'Invalid CSRF token') {
        addResult('Protected Without CSRF', true, 'Correctly blocked request without CSRF token');
      } else {
        addResult('Protected Without CSRF', false, `Unexpected error: ${err.message}`);
      }
    }
  };

  // Test protected route with CSRF
  const testProtectedWithCsrf = async () => {
    try {
      const response = await api.post('/api/test-session', {
        testData: 'CSRF Test ' + new Date().toISOString()
      });
      addResult(
        'Protected With CSRF',
        true,
        'Successfully made request with CSRF token',
        response.data
      );
    } catch (err) {
      addResult(
        'Protected With CSRF',
        false,
        `Failed with CSRF token: ${err.message}`,
        { error: err.response?.data }
      );
    }
  };

  // Test session status
  const testSession = async () => {
    try {
      const response = await axios.get(`${config.BACKEND_URL}/api/debug-session`, {
        withCredentials: true
      });
      addResult(
        'Session Status',
        true,
        'Successfully retrieved session status',
        response.data.sessionStatus
      );
    } catch (err) {
      addResult('Session Status', false, `Failed to get session status: ${err.message}`);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setResults([]);
    await testSession();
    await testGetCsrfToken();
    await testProtectedWithoutCsrf();
    await testProtectedWithCsrf();
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-lg font-bold mb-4">Security Tests</h2>
      
      <div className="space-x-2 mb-4">
        <button 
          onClick={runAllTests}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Run All Tests
        </button>
        
        <button 
          onClick={() => setResults([])}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

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
                  <pre className="text-xs mt-1 bg-white bg-opacity-50 p-1 rounded overflow-auto">
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

export default SecurityTest; 