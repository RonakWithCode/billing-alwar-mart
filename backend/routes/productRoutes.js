const express = require('express');
const { searchProducts, addProduct } = require('../controllers/productController');
const router = express.Router();

router.get('/products/search', searchProducts); // Update if necessary
router.post('/create', addProduct); // Ensure this matches frontend request

module.exports = router;
