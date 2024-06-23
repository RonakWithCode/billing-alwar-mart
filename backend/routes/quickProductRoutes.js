const express = require('express');
const { addQuickProduct, searchQuickProducts, updateQuickProduct, getQuickProductById, deleteQuickProduct } = require('../controllers/quickProductController');
const router = express.Router();
// http://localhost:5001/api/quick-products
router.post('/quick-products', addQuickProduct);
router.get('/quick-products/search', searchQuickProducts);
router.put('/quick-products/:id', updateQuickProduct);
router.get('/quick-products/:id', getQuickProductById);
router.delete('/quick-products/:id', deleteQuickProduct);

module.exports = router;
