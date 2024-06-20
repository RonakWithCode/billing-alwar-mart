import React, { useState } from 'react';

const GenerateBill = () => {
  const [bill, setBill] = useState({
    products: [],
    totalAmount: 0,
  });

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const products = [...bill.products];
    products[index] = {
      ...products[index],
      [name]: value,
    };
    setBill({
      ...bill,
      products,
    });
  };

  const addProduct = () => {
    setBill({
      ...bill,
      products: [...bill.products, { productId: '', quantity: 1 }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call backend API to generate bill
    console.log(bill);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {bill.products.map((product, index) => (
        <div key={index}>
          <label>Product ID:</label>
          <input type="text" name="productId" value={product.productId} onChange={(e) => handleProductChange(index, e)} className="border p-2 rounded" />
          <label>Quantity:</label>
          <input type="number" name="quantity" value={product.quantity} onChange={(e) => handleProductChange(index, e)} className="border p-2 rounded" />
        </div>
      ))}
      <button type="button" onClick={addProduct} className="p-2 bg-green-500 text-white rounded">Add Product</button>
      <div>
        <label>Total Amount:</label>
        <input type="number" name="totalAmount" value={bill.totalAmount} onChange={(e) => setBill({ ...bill, totalAmount: e.target.value })} className="border p-2 rounded" />
      </div>
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">Generate Bill</button>
    </form>
  );
};

export default GenerateBill;
