const mongoose = require('mongoose');
const Bill = require('../models/billModel'); // Assume you have created a Bill model
const PDFDocument = require('pdfkit');
const fs = require('fs');

const saveBillAndGenerateInvoice = async (req, res) => {
  const billData = req.body;
  try {
    const bill = new Bill(billData);
    await bill.save();
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save bill', error });
  }
};

module.exports = { saveBillAndGenerateInvoice };
