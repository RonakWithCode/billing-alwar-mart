import React, { useState } from 'react';

const EditProductModal = ({ product, onClose, onSave }) => {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });

  // useEscapeKey(onClose);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({
      ...updatedProduct,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(updatedProduct);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-1/2">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label>Weight:</label>
            <input
              type="number"
              name="weight"
              value={updatedProduct.weight}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Weight Unit:</label>
            <input
              type="text"
              name="weightSIUnit"
              value={updatedProduct.weightSIUnit}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              name="minSelectableQuantity"
              value={updatedProduct.minSelectableQuantity}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={updatedProduct.price}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={onClose} className="p-2 bg-gray-500 text-white rounded">Cancel</button>
          <button onClick={handleSave} className="p-2 bg-blue-500 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
