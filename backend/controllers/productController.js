const Product = require('../models/productModel');
const { bucket, db } = require('../config/firebase');

const addProduct = async (req, res) => {
  try {
    const productData = req.body;
    console.log(productData);
    // Save product images to Firebase Storage
    // const imageUrls = [];
    // for (const image of productData.productImage) {
    //   const response = await axios.get(image, { responseType: 'stream' });
    //   const blob = bucket.file(`products/${image.split('/').pop()}`);
    //   const blobStream = blob.createWriteStream({
    //     metadata: {
    //       contentType: response.headers['content-type'],
    //     },
    //   });

    //   response.data.pipe(blobStream);

    //   blobStream.on('error', (err) => {
    //     throw new Error('Failed to upload image');
    //   });

    //   blobStream.on('finish', async () => {
    //     await blob.makePublic();
    //     const fileUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    //     imageUrls.push(fileUrl);
    //   });
    // }

    // Update productData with image URLs
    // productData.productImage = imageUrls;

    // Save product to Firestore
    await db.collection('Product').doc(productData.productId).set(productData);

    // Save product to MongoDB
    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addProduct };
