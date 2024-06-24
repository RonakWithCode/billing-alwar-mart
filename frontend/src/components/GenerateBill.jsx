import React, { useState, useEffect } from 'react';
import SearchModal from './SearchModal';
import EditProductModal from './EditProductModal';
import QuickAddProduct from './QuickAddProduct';
import ConfirmPrintModal from './ConfirmPrintModal';
import Toast from './Toasts/Toast'; // Import the Toast component
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import  {generatePDFInvoice}  from './GeneratePDFInvoice'; // Adjust the path as necessary

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
  const [error, setError] = useState(null); // Error state

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
    const existingProduct = billItems.find(item => item._id === product._id);
    if (!existingProduct) {
      setBillItems([...billItems, product]);
      closeSearchModal();
    }
  };

  const saveProduct = (product) => {
    const updatedBillItems = billItems.map(item =>
      item._id === product._id ? product : item
    );
    setBillItems(updatedBillItems);
    closeEditProductModal();
  };

  const deleteProduct = (productId) => {
    const updatedBillItems = billItems.filter(item => item._id !== productId);
    setBillItems(updatedBillItems);
  };

  const save = async () => {
    setToastText('Saving bill...');
    setShowToast(true);

    if (billItems.length < 1) {
      setError('No items to save');
      setShowToast(false);
      return;
    }

    const billNumber = `BILL-${Date.now()}`;
    // Prepare bill data
    const billData = {
      billNumber,
      date: billDate,
      customerName,
      customerPhone,
      customerAddress,
      items: billItems.map(item => ({
        productId: item._id,
        productName: item.productName,
        weight: item.weight,
        weightSIUnit: item.weightSIUnit,
        quantity: item.minSelectableQuantity,
        price: item.price,
        totalPrice: item.minSelectableQuantity * item.price,
      })),
      totalPrice: calculateTotalPrice(),
    };

    try {
      // Save bill to backend
      const response = await axios.post('http://localhost:5001/api/bills', billData);
      // if (response.status === 201) {
        closeConfirmPrintModal();
        setShowToast(false);
        setError(null);
      // }
    } catch (error) {
      setToastText('Failed to save bill');
      setShowToast(false);
      setError(error.message); // Update to set the error message
      console.error('Error saving bill:', error);
    }
  };

  const handleSaveAndPrint = async () => {
   // Usage Example:
const billData = {
  customerDetails: {
    name: 'A.P.S SCHOOL',
    mobile: '9414641072',
    user: 'Lenovo'
  },
  billDetails: {
    number: 'A000298',
    date: '13-06-2024',
    time: '19:21'
  },
  items: [
    { description: 'GLASS', quantity: 10, rate: 25.00, amount: 250.00 },
    { description: 'TEA CUP 12/', quantity: 5, rate: 12.00, amount: 60.00 },
    { description: 'GOOD DAY 10/', quantity: 1, rate: 115.00, amount: 115.00 },
    { description: 'SARAS RED MILK 34/', quantity: 6, rate: 32.00, amount: 192.00 },
    { description: 'NAMKEEN', quantity: 1, rate: 90.00, amount: 90.00 }
  ],
  totals: {
    totalQuantity: 23,
    totalAmount: 707.00,
    amountInWords: 'Seven Hundred Seven Only'
  }
};

const config = {
  companyDetails: {
    name: 'ASHOK GENERAL STORE',
    address: 'KATI GHATI, MALVIYA NAGAR, ALWAR (RAJ.)',
    phone: '9414641072',
    email: 'email@gmail.com',
    gstNumber: '08AEDPJ9090A1ZN'
  },
  footer: {
    terms: [
      'Goods once sold not be taken back & no cash Refund.',
      'All subjects to Alwar Jurisdiction Only.'
    ],
    thankYouMessage: '!!! Thanks !!! Visit Again !!!\n**Free Home Delivery Available**'
  }
};

    try {
generatePDFInvoice(billData, config);

      // await axios.post('http://localhost:5001/api/bills', billData);
    } catch (error) {
      console.error('Error saving bill:', error);
    }
  };


  // const handleSaveAndPrint = async () => {

  //     const billData = {
  //     customerDetails: {
  //       name: 'A.P.S SCHOOL',
  //       mobile: '',
  //       user: 'Lenovo'
  //     },
  //     billDetails: {
  //       number: 'A000298',
  //       date: '13-06-2024',
  //       time: '19:21'
  //     },
  //     items: [
  //       { description: 'GLASS', quantity: 10, rate: 25, amount: 250 },
  //       { description: 'TEA CUP 12/', quantity: 5, rate: 12, amount: 60 },
  //       { description: 'GOOD DAY 10/', quantity: 1, rate: 115, amount: 115 },
  //       { description: 'SARAS RED MILK 34/', quantity: 6, rate: 32, amount: 192 },
  //       { description: 'NAMKEEN', quantity: 1, rate: 90, amount: 90 }
  //     ],
  //     totals: {
  //       totalQuantity: 23,
  //       totalAmount: 707,
  //       amountInWords: 'Seven Hundred Seven Only'
  //     }
  //   };

  //   const config = {
  //     companyDetails: {
  //       name: 'ASHOK GENERAL STORE',
  //       address: 'KATI GHATI, MALVIYA NAGAR, ALWAR (RAJ.)',
  //       phone: '9414641072',
  //       email: 'email@gmail.com',
  //       gstNumber: '08AEDPJ9090A1ZN'
  //     },
  //     footer: {
  //       terms: [
  //         'Goods once sold not be taken back & no cash Refund.',
  //         'All subjects to Alwar Jurisdiction Only.'
  //       ],
  //       thankYouMessage: '!!! Thanks !!! Visit Again !!!\n**Free Home Delivery Available**'
  //     }
  //   };

  //   try {
  //     // await axios.post('http://localhost:5001/api/bills', billData);
  //     const fileName = generatePDFInvoice(billData, config);
  //     window.open(fileName, '_blank'); // Trigger the download of the PDF file
  //   } catch (error) {
  //     console.error('Error saving bill:', error);
  //   }
  // };



  // const handleSaveAndPrint = async () => {
  //   const billData = {
  //     customerDetails: {
  //       name: 'A.P.S SCHOOL',
  //       mobile: '',
  //       user: 'Lenovo'
  //     },
  //     billDetails: {
  //       number: 'A000298',
  //       date: '13-06-2024',
  //       time: '19:21'
  //     },
  //     items: [
  //       { description: 'GLASS', quantity: 10, rate: 25, amount: 250 },
  //       { description: 'TEA CUP 12/', quantity: 5, rate: 12, amount: 60 },
  //       { description: 'GOOD DAY 10/', quantity: 1, rate: 115, amount: 115 },
  //       { description: 'SARAS RED MILK 34/', quantity: 6, rate: 32, amount: 192 },
  //       { description: 'NAMKEEN', quantity: 1, rate: 90, amount: 90 }
  //     ],
  //     totals: {
  //       totalQuantity: 23,
  //       totalAmount: 707,
  //       amountInWords: 'Seven Hundred Seven Only'
  //     }
  //   };

  //   const config = {
  //     companyDetails: {
  //       name: 'ASHOK GENERAL STORE',
  //       address: 'KATI GHATI, MALVIYA NAGAR, ALWAR (RAJ.)',
  //       phone: '9414641072',
  //       email: 'email@gmail.com',
  //       gstNumber: '08AEDPJ9090A1ZN'
  //     },
  //     footer: {
  //       terms: [
  //         'Goods once sold not be taken back & no cash Refund.',
  //         'All subjects to Alwar Jurisdiction Only.'
  //       ],
  //       thankYouMessage: '!!! Thanks !!! Visit Again !!!\n**Free Home Delivery Available**'
  //     }
  //   };

  //   try {
  //     // await axios.post('http://localhost:5001/api/bills', billData);
  //     const fileName = generatePDFInvoice(billData, config);
  //     window.open(fileName, '_blank'); // Trigger the download of the PDF file
  //   } catch (error) {
  //     console.error('Error saving bill:', error);
  //   }
  // };



  // const handleSaveAndPrint = async () => {
  //   const billData = {
  //     billNumber: 'BILL-001',
  //     customerName: 'John Doe',
  //     customerPhone: '1234567890',
  //     customerUser: 'User1',
  //     date: new Date().toLocaleDateString(),
  //     time: new Date().toLocaleTimeString(),
  //     items: [
  //       { productName: 'GLASS', quantity: 10, price: 25, totalPrice: 250 },
  //       { productName: 'TEA CUP', quantity: 5, price: 12, totalPrice: 60 },
  //       { productName: 'GOOD DAY', quantity: 1, price: 115, totalPrice: 115 },
  //       { productName: 'SARAS RED MILK', quantity: 6, price: 32, totalPrice: 192 },
  //       { productName: 'NAMKEEN', quantity: 1, price: 90, totalPrice: 90 },
  //     ],
  //     totalAmount: 707,
  //     amountInWords: 'Seven Hundred Seven Only'
  //   };
    
  //   const config = {
  //     companyName: 'ASHOK GENERAL STORE',
  //     gstNumber: '08AEDPJ9090A1ZN',
  //     companyAddress: 'KATI GHATI, MALVIYA NAGAR, ALWAR (RAJ.)',
  //     phone: '9414641072',
  //     email: 'email@gmail.com',
  //     termsAndConditions: [
  //       'Goods once sold not be taken back & no cash Refund.',
  //       'All subjects to Alwar Jurisdiction Only.'
  //     ],
  //     footerNote: '!!! Thanks !!! Visit Again !!!\n**Free Home Delivery Available**'
  //   };
  //   generatePDFInvoice(billData, config);

  // }

  // const handleSaveAndPrint = async () => {
  //   setToastText('Saving and printing bill...');
  //   setShowToast(true);
  
  //   const billNumber = `BILL-${Date.now()}`;
  //   const billData = {
  //     billNumber,
  //     date: billDate,
  //     customerName,
  //     customerPhone,
  //     customerAddress,
  //     items: billItems.map(item => ({
  //       productId: item._id,
  //       productName: item.productName,
  //       weight: item.weight,
  //       weightSIUnit: item.weightSIUnit,
  //       quantity: item.minSelectableQuantity,
  //       price: item.price,
  //       totalPrice: item.minSelectableQuantity * item.price,
  //     })),
  //     totalPrice: calculateTotalPrice(),
  //   };
  
  //   try {
  //     // await axios.post('http://localhost:5001/api/bills', billData);
  //     // closeConfirmPrintModal();
  //     // setShowToast(false);
  //     // setError(null);

  //     const response = await axios.post('http://localhost:5001/api/bills', billData);


  //     setShowToast(false);
  //     setError(null);


  //     }  catch (error) {
  //     setToastText('Failed to save bill');
  //     setShowToast(false);
  //     setError(error.message); // Update to set the error message
  //     console.error('Error saving bill:', error);
  //   }
  // };
  

  const calculateTotalPrice = () => {
    return billItems.reduce((total, item) => {
      const itemTotal = item.price * item.minSelectableQuantity;
      return total + itemTotal;
    }, 0);
  };

  const closeErrorAlert = () => {
    setError(null);
  };

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
            <th className="px-4 py-2">Total price</th>
            <th className="px-4 py-2">Actions</th>
            <th className="px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {billItems.map((item) => (
            <tr key={item._id}>
              <td className="border px-4 py-2">{item.productName}</td>
              <td className="border px-4 py-2">{item.weight + " " + item.weightSIUnit}</td>
              <td className="border px-4 py-2">{item.minSelectableQuantity}</td>
              <td className="border px-4 py-2">{item.price}</td>
              <td className="border px-4 py-2">{item.minSelectableQuantity * item.price}</td>
              <td className="border px-4 py-2">
                <button onClick={() => openEditProductModal(item)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              </td>
              <td className="border px-4 py-2">
                <button onClick={() => deleteProduct(item._id)} className=" text-white px-2 py-1 rounded">❌</button>
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
{/* 
<AddCustomer /> */}

    </div>
  );
};

export default GenerateBill;
