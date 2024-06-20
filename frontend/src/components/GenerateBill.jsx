import React, { useState } from 'react';
import SearchModal from './SearchModal';
import EditProductModal from './EditProductModal';

const GenerateBill = () => {
  const [billItems, setBillItems] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  const openEditProductModal = (product) => {
    setSelectedProduct(product);
    setIsEditProductModalOpen(true);
  };
  const closeEditProductModal = () => setIsEditProductModalOpen(false);

  const addToBill = (product) => {
    setBillItems([...billItems, product]);
    closeSearchModal();
  };

  const saveProduct = (product) => {
    const updatedBillItems = billItems.map(item =>
      item.productId === product.productId ? product : item
    );
    setBillItems(updatedBillItems);
    closeEditProductModal();
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
      <button onClick={openSearchModal} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Search Products</button>

      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Weight</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Discount</th>
            <th className="px-4 py-2">Actions</th>
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
              <td className="border px-4 py-2">
                <button onClick={() => openEditProductModal(item)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
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
