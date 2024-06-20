import React from 'react';
import GenerateBill from '../components/GenerateBill';

const GenerateBillPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Bill</h1>
      <GenerateBill />
    </div>
  );
};

export default GenerateBillPage;
