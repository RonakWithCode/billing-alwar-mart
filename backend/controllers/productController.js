const Product = require('../models/productModel');
const { bucket, db } = require('../config/firebase');

const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.find({
      $or: [
        { productName: { $regex: query, $options: 'i' } },
        { Barcode: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { subCategory: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { productType: { $regex: query, $options: 'i' } },
        { productId: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const productData = req.body;
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { searchProducts, addProduct };
