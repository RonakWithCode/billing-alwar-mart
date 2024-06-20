const express = require('express');
const { addBrand, getBrands } = require('../controllers/brandController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', upload.single('image'), addBrand);
router.get('/', getBrands);

module.exports = router;
