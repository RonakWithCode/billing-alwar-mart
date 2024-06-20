const express = require('express');
const { addProduct } = require('../controllers/productController');
const router = express.Router();

router.post('/', addProduct);

module.exports = router;
