import React, { useState, useEffect } from 'react';
import SearchModal from './SearchModal';
import EditProductModal from './EditProductModal';
import QuickAddProduct from './QuickAddProduct';
import ConfirmPrintModal from './ConfirmPrintModal';
import Toast from './Toasts/Toast'; // Import the Toast component
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GenerateBill = () => {
  const [billItems, setBillItems] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [isConfirmPrintModalOpen, setIsConfirmPrintModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().substring(0, 10));

  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('Action in progress');

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isSearchModalOpen) {
          closeSearchModal();
        } else if (isEditProductModalOpen) {
          closeEditProductModal();
        } else if (isQuickAddModalOpen) {
          closeQuickAddModal();
        } else if (isConfirmPrintModalOpen) {
          closeConfirmPrintModal();
        } else {
          navigate('/');
        }
      }

      // Prevent default behavior for specific key combinations
      if ((e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.key === 'R')) {
        e.preventDefault();
        // Custom action for Ctrl+R
      } else if ((e.ctrlKey && e.key === 's') || (e.ctrlKey && e.key === 'S')) {
        e.preventDefault();
        // Custom action for Ctrl+S
        save();
      } else if ((e.ctrlKey && e.key === 'p') || (e.ctrlKey && e.key === 'P')) {
        e.preventDefault();
        // Custom action for Ctrl+P
        handleSaveAndPrint();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, isSearchModalOpen, isEditProductModalOpen, isQuickAddModalOpen, isConfirmPrintModalOpen]);

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  const openEditProductModal = (product) => {
    setSelectedProduct(product);
    setIsEditProductModalOpen(true);
  };

  const closeEditProductModal = () => setIsEditProductModalOpen(false);

  const openQuickAddModal = () => setIsQuickAddModalOpen(true);
  const closeQuickAddModal = () => setIsQuickAddModalOpen(false);

  const openConfirmPrintModal = () => setIsConfirmPrintModalOpen(true);
  const closeConfirmPrintModal = () => setIsConfirmPrintModalOpen(false);

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

  const save = async () => {
    setToastText('Saving bill...');
    setShowToast(true);

    const billNumber = `BILL-${Date.now()}`;
    // Prepare bill data
    const billData = {
      billNumber,
      date: billDate,
      customerName,
      customerPhone,
      customerAddress,
      items: billItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        weight: item.weight,
        weightSIUnit: item.weightSIUnit,
        quantity: item.minSelectableQuantity,
        price: item.price,
        discount: item.discount,
        totalPrice: item.minSelectableQuantity * item.price - (item.discount / 100) * (item.minSelectableQuantity * item.price),
      })),
      totalPrice: calculateTotalPrice(),
    };

    try {
      // Save bill to backend
      const response = await axios.post('http://localhost:5001/api/bills', billData);
      if (response.status === 201) {
        closeConfirmPrintModal();
        setShowToast(false);
      }

    } catch (error) {
      setToastText('Failed to save bill');
      setShowToast(true);
      console.error('Error saving bill:', error);
      alert('Failed to save bill');
    }
  };

  const handleSaveAndPrint = async () => {
    setToastText('Saving and printing bill...');
    setShowToast(true);

    const billNumber = `BILL-${Date.now()}`;
    const billData = {
      billNumber,
      date: billDate,
      customerName,
      customerPhone,
      customerAddress,
      items: billItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        weight: item.weight,
        weightSIUnit: item.weightSIUnit,
        quantity: item.minSelectableQuantity,
        price: item.price,
        discount: item.discount,
        totalPrice: item.minSelectableQuantity * item.price - (item.discount / 100) * (item.minSelectableQuantity * item.price),
      })),
      totalPrice: calculateTotalPrice(),
    };

    try {
      const response = await axios.post('http://localhost:5001/api/bills', billData);
      if (response.status === 201) {
        closeConfirmPrintModal();
        setShowToast(false);
        window.print();
      }

    } catch (error) {
      setToastText('Failed to save bill');
      setShowToast(true);
      console.error('Error saving bill:', error);
      alert('Failed to save bill');
    }
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
      <Toast show={showToast} text={toastText} />

      <h1 className="text-2xl font-bold mb-4">Generate Bill</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
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
          <label>Phone Number:</label>
          <input
            type="tel"
            maxLength={10}
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label>Bill Date:</label>
          <input
            type="date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      <button onClick={openSearchModal} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Search Products</button>
      <button onClick={openQuickAddModal} className="bg-green-500 text-white px-4 py-2 rounded mb-4">Quick Add Product</button>

      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Weight</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Discount</th>
            <th className="px-4 py-2">Total price</th>
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

      <button onClick={openConfirmPrintModal} className="bg-green-500 text-white px-4 py-2 rounded">Print Bill</button>

      {isSearchModalOpen && <SearchModal onClose={closeSearchModal} onSelect={addToBill} />}
      {isEditProductModalOpen && <EditProductModal product={selectedProduct} onClose={closeEditProductModal} onSave={saveProduct} />}
      {isQuickAddModalOpen && <QuickAddProduct onClose={closeQuickAddModal} />}
      {isConfirmPrintModalOpen && (
        <ConfirmPrintModal
          onClose={closeConfirmPrintModal}
          onSave={save}
          onSaveAndPrint={handleSaveAndPrint}
        />
      )}
    </div>
  );
};

export default GenerateBill;
