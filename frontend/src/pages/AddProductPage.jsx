import React from 'react';
import AddProduct from '../components/AddProduct';

const AddProductPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <AddProduct />
    </div>
  );
};

export default AddProductPage;
