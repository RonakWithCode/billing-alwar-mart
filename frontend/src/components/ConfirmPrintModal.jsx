import React from 'react';

const ConfirmPrintModal = ({ onClose, onSave, onSaveAndPrint }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-1/3">
        <h2 className="text-xl font-bold mb-4">Print or Save Bill</h2>
        <p className="mb-4">Do you want to print the bill or save and print it?</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="p-2 bg-gray-500 text-white rounded">Cancel</button>
          <button onClick={onSave} className="p-2 bg-green-500 text-white rounded">Print</button>
          <button onClick={onSaveAndPrint} className="p-2 bg-blue-500 text-white rounded">Save and Print</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPrintModal;
