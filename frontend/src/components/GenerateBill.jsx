import React, { useState, useEffect } from 'react';
import SearchModal from './SearchModal';
import EditProductModal from './EditProductModal';
import { useNavigate } from 'react-router-dom';

const GenerateBill = () => {
  const [billItems, setBillItems] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isSearchModalOpen) {
          closeSearchModal();
        } else if (isEditProductModalOpen) {
          closeEditProductModal();
        } else {
          navigate('/');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, isSearchModalOpen, isEditProductModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails({ ...customerDetails, [name]: value });
  };

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  const openEditProductModal = (product) => {
    setSelectedProduct(product);
    setIsEditProductModalOpen(true);
  };

  const closeEditProductModal = () => setIsEditProductModalOpen(false);

  const addToBill = (product) => {
    const existingProduct = billItems.find(item => item.productId === product.productId);
    if (!existingProduct) {
      setBillItems([...billItems, product]);
      closeSearchModal();
    }
  };

  const saveProduct = (product) => {
    const updatedBillItems = billItems.map(item =>
      item.productId === product.productId ? product : item
    );
    setBillItems(updatedBillItems);
    closeEditProductModal();
  };

  const deleteProduct = (productId) => {
    const updatedBillItems = billItems.filter(item => item.productId !== productId);
    setBillItems(updatedBillItems);
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateTotalPrice = () => {
    return billItems.reduce((total, item) => {
      const itemTotal = item.price * item.minSelectableQuantity;
      const itemDiscount = item.discount ? (item.discount / 100) * itemTotal : 0;
      return total + (itemTotal - itemDiscount);
    }, 0);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Bill</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Customer Name (Optional):</label>
          <input
            type="text"
            name="name"
            value={customerDetails.name}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            placeholder="Enter customer name"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number (Optional):</label>
          <input
            type="tel"
            name="phone"
            value={customerDetails.phone}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            placeholder="Enter phone number"
            maxLength={10}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Address (Optional):</label>
        <input
          type="text"
          name="address"
          value={customerDetails.address}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
          placeholder="Enter address"
        />
      </div>
      <button onClick={openSearchModal} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Search Products</button>

      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Weight</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Discount</th>
            <th className="px-4 py-2">Total Price</th>
            <th className="px-4 py-2">Actions</th>
            <th className="px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {billItems.map((item) => (
            <tr key={item.productId}>
              <td className="border px-4 py-2">{item.productName}</td>
              <td className="border px-4 py-2">{item.weight + " " + item.weightSIUnit}</td>
              <td className="border px-4 py-2">{item.minSelectableQuantity}</td>
              <td className="border px-4 py-2">{item.price}</td>
              <td className="border px-4 py-2">{item.discount}</td>
              <td className="border px-4 py-2">{item.minSelectableQuantity * item.price}</td>
              <td className="border px-4 py-2">
                <button onClick={() => openEditProductModal(item)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              </td>
              <td className="border px-4 py-2">
                <button onClick={() => deleteProduct(item.productId)} className="bg-red-500 text-white px-2 py-1 rounded">❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right font-bold mb-4">
        Total Price: ₹{calculateTotalPrice().toFixed(2)}
      </div>

      <button onClick={handlePrint} className="bg-green-500 text-white px-4 py-2 rounded">Print Bill</button>

      {isSearchModalOpen && <SearchModal onClose={closeSearchModal} onSelect={addToBill} />}
      {isEditProductModalOpen && <EditProductModal product={selectedProduct} onClose={closeEditProductModal} onSave={saveProduct} />}
    </div>
  );
};

export default GenerateBill;
