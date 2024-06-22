const express = require('express');
const { saveBill } = require('../controllers/billController');
const router = express.Router();

router.post('/bills', saveBill);

module.exports = router;
