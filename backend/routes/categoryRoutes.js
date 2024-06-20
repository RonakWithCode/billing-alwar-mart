const express = require('express');
const { addCategory, getCategories } = require('../controllers/categoryController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', upload.single('image'), addCategory);
router.get('/', getCategories);

module.exports = router;
