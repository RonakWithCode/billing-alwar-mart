const QuickProduct = require('../models/quickProductModel');

const addQuickProduct = async (req, res) => {
  const { productName, productMRP, productPrice, productBarcode, brandName, weight, weightSIUnit } = req.body;

  const newQuickProduct = new QuickProduct({
    productName,
    productMRP,
    productPrice,
    productBarcode,
    brandName,
    weight,
    weightSIUnit
  });

  try {
    await newQuickProduct.save();
    res.status(201).json(newQuickProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const searchQuickProducts = async (req, res) => {
  const { query } = req.query;
  try {
    const products = await QuickProduct.find({
      $or: [
        { productName: { $regex: query, $options: 'i' } },
        { brandName: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addQuickProduct, searchQuickProducts };
