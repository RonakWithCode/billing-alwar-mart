import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddProductPage from './pages/AddProductPage';
import GenerateBillPage from './pages/GenerateBillPage';
import ModifyBillPage from './pages/ModifyBillPage';
import QuickManagerProduct from './pages/QuickManagerProduct';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* add-quick */}
        {/* AddQuickPage */}
        <Route path="/quick" element={<QuickManagerProduct />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/generate-bill" element={<GenerateBillPage />} />
        <Route path="/modify-bill" element={<ModifyBillPage />} />
      </Routes>
    </Router>
  );
};

export default App;
