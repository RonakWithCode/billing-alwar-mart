const Category = require('../models/categoryModel');
const { bucket, db } = require('../config/firebase');

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let imageUrl = '';

    if (req.file) {
      const blob = bucket.file(`categories/${req.file.originalname}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on('error', (err) => {
        throw new Error('Failed to upload image');
      });

      blobStream.on('finish', async () => {
        imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        await blob.makePublic(); // Make the file publicly accessible
        await db.collection('Category').doc(name).set({
          imageUri: imageUrl,
          tag: name
        });
        const category = new Category({ name, imageUri: imageUrl });
        await category.save();
        res.status(201).json(category);
      });

      blobStream.end(req.file.buffer);
    } else {
      const category = new Category({ name });
      await category.save();
      res.status(201).json(category);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addCategory, getCategories };
