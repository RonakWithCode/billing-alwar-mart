const Brand = require('../models/brandModel');
const { bucket, db } = require('../config/firebase');

const addBrand = async (req, res) => {
  try {
    const { name } = req.body;
    let imageUrl = '';

    if (req.file) {
      const blob = bucket.file(`brands/${req.file.originalname}`);
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
        await db.collection('Brand').doc(name).set({
          brandIcon: imageUrl,
          brandName: name
        });
        const brand = new Brand({ name, imageUri: imageUrl });
        await brand.save();
        res.status(201).json(brand);
      });

      blobStream.end(req.file.buffer);
    } else {
      const brand = new Brand({ name });
      await brand.save();
      res.status(201).json(brand);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.status(200).json(brands);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addBrand, getBrands };
