const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  isAvailable: { type: Boolean, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productDescription: { type: String},
  Barcode: { type: String },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number },
  stockCount: { type: Number, required: true },
  minSelectableQuantity: { type: Number, required: true },
  maxSelectableQuantity: { type: Number, required: true },
  selectableQuantity: { type: Number, required: true },
  weight: { type: String, required: true },
  weightSIUnit: { type: String, required: true },
  productLife: { type: String },
  productType: { type: String, required: true },
  productIsFoodItem: { type: String, required: true },
  keywords: { type: [String], required: true },
  productImage: { type: [String], required: true },
  SponsorHomeType: { type: String, required: true },
  SponsorSerachType: { type: String, required: true },
  SponsorRecommendationType: { type: String, required: true },
  variations: { type: [Object] },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
