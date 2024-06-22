import React, { useState } from 'react';
import axios from 'axios';

const QuickAddProduct = ({ onClose }) => {
  const [productName, setProductName] = useState('');
  const [productMRP, setProductMRP] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productBarcode, setProductBarcode] = useState('');
  const [brandName, setBrandName] = useState('');
  const [weight, setWeight] = useState('');
  const [weightSIUnit, setWeightSIUnit] = useState('');
  const [minSelectableQuantity, setMinSelectableQuantity] = useState(''); // Add this line

  const handleAddProduct = async () => {
    const productData = {
      productName,
      productMRP,
      productPrice,
      productBarcode,
      brandName,
      weight,
      weightSIUnit,
      minSelectableQuantity // Add this line
    };

    try {
      await axios.post('http://localhost:5001/api/quick-products', productData);
      // const response = await axios.post('http://localhost:5001/api/quick-products', productData);
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-1/2">
        <h2 className="text-xl font-bold mb-4">Quick Add Product</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label>Product Name:</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Product MRP:</label>
            <input
              type="number"
              value={productMRP}
              onChange={(e) => setProductMRP(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Product Price:</label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Product Barcode:</label>
            <input
              type="text"
              value={productBarcode}
              onChange={(e) => setProductBarcode(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Brand Name (Optional):</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Weight:</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Weight SI Unit:</label>
            <input
              type="text"
              value={weightSIUnit}
              onChange={(e) => setWeightSIUnit(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Min. Selectable Quantity:</label>
            <input
              type="number"
              value={minSelectableQuantity}
              onChange={(e) => setMinSelectableQuantity(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="p-2 bg-gray-500 text-white rounded">Cancel</button>
          <button onClick={handleAddProduct} className="p-2 bg-blue-500 text-white rounded">Add</button>
        </div>
      </div>
    </div>
  );
};

export default QuickAddProduct;





