import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Billing Application</h1>
      <nav>
        <ul>
          <li>
            <Link to="/quick" className="text-blue-500">Add quick Product</Link>
          </li>
          <li>
            <Link to="/add-product" className="text-blue-500">Add Product</Link>
          </li>
          <li>
            <Link to="/generate-bill" className="text-blue-500">Generate Bill</Link>
          </li>
          <li>
            <Link to="/modify-bill" className="text-blue-500">Modify Bill</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
