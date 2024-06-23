const mongoose = require('mongoose');

const quickProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  mrp: { type: Number, required: true },
  price: { type: Number, required: true },
  Barcode: { type: String, required: true },
  brand: { type: String },
  weight: { type: Number, required: true },
  weightSIUnit: { type: String, required: true },
  minSelectableQuantity: { type: Number, required: true },

});

module.exports = mongoose.model('QuickProduct', quickProductSchema);
