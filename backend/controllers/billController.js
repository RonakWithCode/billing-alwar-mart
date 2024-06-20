const Bill = require('../models/billModel');

const generateBill = async (req, res) => {
  try {
    const bill = new Bill(req.body);
    await bill.save();
    res.status(201).json(bill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({}).populate('products');
    res.status(200).json(bills);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { generateBill, getBills };
