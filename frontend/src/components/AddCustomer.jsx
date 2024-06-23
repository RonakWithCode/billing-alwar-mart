import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Toast from './Toasts/Toast';
import AddCustomerModal from './AddCustomerModal';

const AddCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isAddCustomerModalOpen) {
          closeAddCustomerModal();
        } else {
          navigate('/');
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCustomerIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredCustomers.length - 1
        );
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCustomerIndex((prevIndex) =>
          prevIndex < filteredCustomers.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === 'Enter' && selectedCustomerIndex >= 0) {
        const selectedCustomer = filteredCustomers[selectedCustomerIndex];
        console.log('Selected Customer Details:', selectedCustomer);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredCustomers, selectedCustomerIndex, navigate, isAddCustomerModalOpen]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/customers');
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setSelectedCustomerIndex(-1);
  };

  const openAddCustomerModal = () => setIsAddCustomerModalOpen(true);
  const closeAddCustomerModal = () => setIsAddCustomerModalOpen(false);

  const handleAddCustomer = async (newCustomer) => {
    try {
      const response = await axios.post('http://localhost:5001/api/customers', newCustomer);
      if (response.status === 201) {
        fetchCustomers();
        closeAddCustomerModal();
      }
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const closeErrorAlert = () => setError(null);

  return (
    <div className="container mx-auto p-4">
      <Toast show={showToast} text={toastText} />
      <h1 className="text-2xl font-bold mb-4">Generate Bill</h1>

      {error && (
        <div className="mt-2 bg-red-500 text-sm text-white rounded-lg p-4 flex justify-between items-center" role="alert">
          <span><span className="font-bold">Error:</span> {error}</span>
          <button onClick={closeErrorAlert} className="text-white ml-4">✖</button>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search customers..."
          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button onClick={openAddCustomerModal} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        Add Customer Details
      </button>

      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg overflow-hidden dark:border-neutral-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Name</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Phone</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Address</th>
                    <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {filteredCustomers.map((customer, index) => (
                    <tr
                      key={customer._id}
                      className={`cursor-pointer ${selectedCustomerIndex === index ? 'bg-blue-500 text-white' : ''}`}
                      onClick={() => setSelectedCustomerIndex(index)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{customer.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{customer.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                        <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={closeAddCustomerModal}
        onSave={handleAddCustomer}
      />
    </div>
  );
};

export default AddCustomer;
