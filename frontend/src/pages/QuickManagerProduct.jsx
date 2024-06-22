import React, { useState, useEffect } from 'react';
import QuickAddProduct from '../components/QuickAddProduct';
import axios from 'axios';
import Toast from '../components/Toasts/Toast';

const QuickManagerProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setShowToast(true);
    setToastText('Loading products...');
    try {
      const response = await axios.get('http://localhost:5001/api/quick-products/search', {
        params: { query: searchQuery }
      });
      setProducts(response.data);
      setShowToast(false);
    } catch (error) {
      setShowToast(true);
      setToastText('Failed to load products');
      setError(error.message);
    }
  };

  const handleAddProduct = () => {
    setIsQuickAddModalOpen(true);
  };

  const handleEditProduct = async (product) => {
    const confirmSave = window.confirm('Do you want to save changes?');
    if (confirmSave) {
      setShowToast(true);
      setToastText('Saving product...');
      try {
        await axios.put(`http://localhost:5001/api/quick-products/${product._id}`, product);
        fetchProducts();
        setShowToast(false);
        setSelectedProduct(null);
      } catch (error) {
        setShowToast(true);
        setToastText('Failed to save product');
        setError(error.message);
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm('Do you want to delete this product?');
    if (confirmDelete) {
      setShowToast(true);
      setToastText('Deleting product...');
      try {
        await axios.delete(`http://localhost:5001/api/quick-products/${productId}`);
        fetchProducts();
        setShowToast(false);
        setSelectedProduct(null);
      } catch (error) {
        setShowToast(true);
        setToastText('Failed to delete product');
        setError(error.message);
      }
    }
  };

  const closeQuickAddModal = () => {
    setIsQuickAddModalOpen(false);
    fetchProducts();
  };

  const closeEditProductModal = () => {
    setIsEditProductModalOpen(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  const closeErrorAlert = () => {
    setError(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedProduct((prevSelected) => {
        const currentIndex = products.findIndex((product) => product._id === prevSelected?._id);
        const nextIndex = (currentIndex + 1) % products.length;
        return products[nextIndex];
      });
    } else if (e.key === 'ArrowUp') {
      setSelectedProduct((prevSelected) => {
        const currentIndex = products.findIndex((product) => product._id === prevSelected?._id);
        const nextIndex = (currentIndex - 1 + products.length) % products.length;
        return products[nextIndex];
      });
    } else if (e.key === 'Enter' && selectedProduct) {
      setIsEditProductModalOpen(true);
    } else if (e.key === 'Delete' && selectedProduct) {
      handleDeleteProduct(selectedProduct._id);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [products, selectedProduct]);

  return (
    <div className="container mx-auto p-4">
      <Toast show={showToast} text={toastText} />
      <h1 className="text-2xl font-bold mb-4">Quick Manager Product</h1>
      <button onClick={handleAddProduct} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Quick Product</button>
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="border p-2 rounded w-full mb-4"
      />
      {error && (
        <div className="mt-2 bg-red-500 text-sm text-white rounded-lg p-4 flex justify-between items-center" role="alert">
          <span><span className="font-bold">Error:</span> {error}</span>
          <button onClick={closeErrorAlert} className="text-white ml-4">✖</button>
        </div>
      )}
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Product Name</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Brand</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Weight</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">MRP</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Price</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Min. Qty.</th>
                    <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {products
                    .filter((product) =>
                      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      product.brandName.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((product) => (
                      <tr key={product._id} onClick={() => setSelectedProduct(product)} className={`cursor-pointer ${selectedProduct && selectedProduct._id === product._id ? 'bg-blue-500 text-white' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{product.brandName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{product.weight + " " + product.weightSIUnit}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{"₹" + product.productMRP}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{"₹" + product.productPrice}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{product.minSelectableQuantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          <button onClick={() => setIsEditProductModalOpen(true)} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-yellow-500 hover:text-yellow-700 disabled:opacity-50 disabled:pointer-events-none">Edit</button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-500 hover:text-red-700 disabled:opacity-50 disabled:pointer-events-none ml-2">Delete</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isQuickAddModalOpen && <QuickAddProduct onClose={closeQuickAddModal} />}
      {isEditProductModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label>Product Name:</label>
                <input
                  type="text"
                  value={selectedProduct.productName}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, productName: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label>Brand Name (Optional):</label>
                <input
                  type="text"
                  value={selectedProduct.brandName}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, brandName: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label>Weight:</label>
                <input
                  type="number"
                  value={selectedProduct.weight}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, weight: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label>Weight SI Unit:</label>
                <input
                  type="text"
                  value={selectedProduct.weightSIUnit}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, weightSIUnit: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label>MRP:</label>
                <input
                  type="number"
                  value={selectedProduct.productMRP}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, productMRP: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label>Price:</label>
                <input
                  type="number"
                  value={selectedProduct.productPrice}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, productPrice: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label>Barcode:</label>
                <input
                  type="text"
                  value={selectedProduct.productBarcode}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, productBarcode: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label>Min. Selectable Quantity:</label>
                <input
                  type="number"
                  value={selectedProduct.minSelectableQuantity}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, minSelectableQuantity: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={closeEditProductModal} className="p-2 bg-gray-500 text-white rounded">Cancel</button>
              <button onClick={() => handleEditProduct(selectedProduct)} className="p-2 bg-blue-500 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickManagerProduct;