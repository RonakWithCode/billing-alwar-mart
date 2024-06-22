const mongoose = require('mongoose');

const quickProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productMRP: { type: Number, required: true },
  productPrice: { type: Number, required: true },
  productBarcode: { type: String, required: true },
  brandName: { type: String },
  weight: { type: Number, required: true }, // Add this line
  weightSIUnit: { type: String, required: true } // Add this line
});

module.exports = mongoose.model('QuickProduct', quickProductSchema);
