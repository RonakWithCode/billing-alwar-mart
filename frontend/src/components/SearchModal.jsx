import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useEscapeKey from './useEscapeKey';

const SearchModal = ({ onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);


  // useEscapeKey(onClose);


  useEffect(() => {
    if (searchQuery) {
      axios.get(`http://localhost:5001/api/add/products/search?query=${searchQuery}`)
        .then((response) => setSearchResults(response.data))
        .catch((error) => console.error(error));
    }
  }, [searchQuery]);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, searchResults.length - 1));
    } else if (event.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (event.key === 'Enter' && selectedIndex >= 0) {
      onSelect(searchResults[selectedIndex]);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center" 
    onKeyDown={handleKeyDown}
    
    >
      <div className="bg-white p-4 rounded w-3/4 h-3/4 overflow-auto">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Weight</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Discount</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((product, index) => (
              <tr key={product.productId} 
              className={selectedIndex === index ? 'bg-blue-500 text-white' : ''}>
                <td className="border px-4 py-2">{product.productName}</td>
                <td className="border px-4 py-2">{product.weight +" "+ product.weightSIUnit}</td>
                <td className="border px-4 py-2">{product.minSelectableQuantity}</td>
                <td className="border px-4 py-2">{product.price}</td>
                <td className="border px-4 py-2">{product.discount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
};

export default SearchModal;
