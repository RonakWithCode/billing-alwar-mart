const express = require('express');
const { addSubCategory, getSubCategories } = require('../controllers/subCategoryController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', addSubCategory);
router.get('/', getSubCategories);

module.exports = router;
