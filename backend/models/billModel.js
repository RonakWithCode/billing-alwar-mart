const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  customerName: { type: String },
  customerPhone: { type: String },
  customerAddress: { type: String },
  items: [
    {
      productId: { type: String, required: true },
      productName: { type: String, required: true },
      weight: { type: String, required: true },
      weightSIUnit: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      discount: { type: Number },
      totalPrice: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
});

const Bill = mongoose.model('Bill', BillSchema);

module.exports = Bill;
