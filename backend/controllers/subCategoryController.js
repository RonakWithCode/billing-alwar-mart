const SubCategory = require('../models/subCategoryModel');
const { db } = require('../config/firebase');

const addSubCategory = async (req, res) => {
  try {
    const { name } = req.body;

    await db.collection('SubCategory').doc(name).set({
      subCategoryName: name
    });
    const subCategory = new SubCategory({ name });
    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({});
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addSubCategory, getSubCategories };
