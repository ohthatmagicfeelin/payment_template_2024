import React from 'react';
import SessionTest from '../components/SessionTest';
import CsrfTest from '../components/CsrfTest';

const TestPage = () => {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <SessionTest />
      <CsrfTest />
    </div>
  );
};

export default TestPage; 