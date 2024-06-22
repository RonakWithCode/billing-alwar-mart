const QuickProduct = require('../models/quickProductModel');

const addQuickProduct = async (req, res) => {
  const { productName, productMRP, productPrice, productBarcode, brandName, weight, weightSIUnit, minSelectableQuantity } = req.body;

  // Validate input data
  if (!productName || !productMRP || !productPrice || !productBarcode || !weight || !weightSIUnit || minSelectableQuantity == null) {
    return res.status(400).json({ message: 'All fields are required except brandName' });
  }

  const newQuickProduct = new QuickProduct({
    productName,
    productMRP,
    productPrice,
    productBarcode,
    brandName,
    weight,
    weightSIUnit,
    minSelectableQuantity // Add this line
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

const updateQuickProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedProduct = await QuickProduct.findByIdAndUpdate(id, updates, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getQuickProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await QuickProduct.findById(id);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteQuickProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await QuickProduct.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addQuickProduct, searchQuickProducts, updateQuickProduct, getQuickProductById, deleteQuickProduct };
