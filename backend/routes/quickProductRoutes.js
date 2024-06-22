const express = require('express');
const { addQuickProduct, searchQuickProducts } = require('../controllers/quickProductController');
const router = express.Router();

router.post('/quick-products', addQuickProduct);
router.get('/quick-products/search', searchQuickProducts);

module.exports = router;
