import React, { useState, useEffect } from 'react';

const ModifyBill = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      // Fetch bills from backend API
      setBills([{ _id: '1', products: [{ productId: '123', quantity: 1 }], totalAmount: 100 }]);
    };

    fetchBills();
  }, []);

  const handleBillChange = (e) => {
    const bill = bills.find(b => b._id === e.target.value);
    setSelectedBill(bill);
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const products = [...selectedBill.products];
    products[index] = {
      ...products[index],
      [name]: value,
    };
    setSelectedBill({
      ...selectedBill,
      products,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call backend API to modify bill
    console.log(selectedBill);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Select Bill:</label>
        <select onChange={handleBillChange} className="border p-2 rounded">
          <option value="">Select a bill</option>
          {bills.map((bill) => (
            <option key={bill._id} value={bill._id}>
              {bill._id}
            </option>
          ))}
        </select>
      </div>
      {selectedBill && selectedBill.products.map((product, index) => (
        <div key={index}>
          <label>Product ID:</label>
          <input type="text" name="productId" value={product.productId} onChange={(e) => handleProductChange(index, e)} className="border p-2 rounded" />
          <label>Quantity:</label>
          <input type="number" name="quantity" value={product.quantity} onChange={(e) => handleProductChange(index, e)} className="border p-2 rounded" />
        </div>
      ))}
      {selectedBill && (
        <div>
          <label>Total Amount:</label>
          <input type="number" name="totalAmount" value={selectedBill.totalAmount} onChange={(e) => setSelectedBill({ ...selectedBill, totalAmount: e.target.value })} className="border p-2 rounded" />
        </div>
      )}
      {selectedBill && <button type="submit" className="p-2 bg-blue-500 text-white rounded">Modify Bill</button>}
    </form>
  );
};

export default ModifyBill;
