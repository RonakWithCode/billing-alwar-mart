const express = require('express');
const { saveBillAndGenerateInvoice } = require('../controllers/billController');
const router = express.Router();

router.post('/bills', saveBillAndGenerateInvoice);

module.exports = router;
