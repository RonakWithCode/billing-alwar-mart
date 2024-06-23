import React, { useState } from 'react';

const AddCustomerModal = ({ isOpen, onClose, onSave }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const handleSave = () => {
    if (customerName && customerPhone && customerAddress) {
      onSave({ name: customerName, phone: customerPhone, address: customerAddress });
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-1/2">
        <h2 className="text-xl font-bold mb-4">Add Customer Details</h2>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label>Customer Name:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Customer Phone:</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Customer Address:</label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="p-2 bg-gray-500 text-white rounded">Cancel</button>
          <button onClick={handleSave} className="p-2 bg-blue-500 text-white rounded">Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;
