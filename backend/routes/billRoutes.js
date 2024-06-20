const express = require('express');
const { generateBill, getBills } = require('../controllers/billController');

const router = express.Router();

router.post('/', generateBill);
router.get('/', getBills);

module.exports = router;
