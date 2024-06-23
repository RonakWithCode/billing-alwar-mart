const Product = require('../models/productModel');
const QuickProduct = require('../models/quickProductModel');
const { db } = require('../config/firebase'); // Import the Firestore instance

// const { bucket, db } = require('../config/firebase');

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


    await db.collection('Product').doc(product.productId.toString()).set({
      isAvailable: product.isAvailable,
      productId: product.productId,
      productName: product.productName,
      productDescription: product.productDescription,
      Brand: product.brand,
      category: product.category,
      subCategory: product.subCategory,
      price: product.price,
      mrp: product.mrp,
      discount: product.discount,
      stockCount: product.stockCount,
      minSelectableQuantity: product.minSelectableQuantity,
      MaxSelectableQuantity: product.maxSelectableQuantity,
      SelectableQuantity: product.selectableQuantity,
      weight: product.weight,
      weightSIUnit: product.weightSIUnit,
      productLife: product.productLife,
      productType: product.productType,
      productIsFoodItem: product.productIsFoodItem,
      keywords: product.keywords,
      ProductImage: product.productImage,
      variations: product.variations,
      sponsorTypeModel: [],
      stockEntries: [],


      // Add any other fields you want to store in Firestore
    });



  
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// const addProductBothQuickAndMain = async (req, res) => {
//   try {
//     const { productName, productMRP, productPrice, productBarcode, brandName, weight, weightSIUnit, minSelectableQuantity } = req.body;
//     const productData = req.body;
//     const product = new Product(productData);
//     await product.save();


//     const newQuickProduct = new QuickProduct({
//       productName,
//       productMRP,
//       productPrice,
//       productBarcode,
//       brandName,
//       weight,
//       weightSIUnit,
//       minSelectableQuantity // Add this line
//     });

//     await newQuickProduct.save();


//     res.status(201).json(product);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// }


const addProductBothQuickAndMain = async (req, res) => {
  try {
    // const {
    //   productName,
    //   productMRP,
    //   productPrice,
    //   productBarcode,
    //   brandName,
    //   weight,
    //   weightSIUnit,
    //   minSelectableQuantity,
    // } = req.body;


    
    // Validate the required fields
    // if (!productName || !productMRP || !productPrice || !productBarcode || !weight || !weightSIUnit || !minSelectableQuantity) {
    //   return res.status(400).json({ message: 'All fields are required except brandName' });
    // }
    const MainproductData = req.body;

    const product = new Product(MainproductData);
    await product.save();


    await db.collection('Product').doc(product.productId.toString()).set({
      isAvailable: product.isAvailable,
      productId: product.productId,
      productName: product.productName,
      productDescription: product.productDescription,
      Brand: product.brand,
      category: product.category,
      subCategory: product.subCategory,
      price: product.price,
      mrp: product.mrp,
      discount: product.discount,
      stockCount: product.stockCount,
      minSelectableQuantity: product.minSelectableQuantity,
      MaxSelectableQuantity: product.maxSelectableQuantity,
      SelectableQuantity: product.selectableQuantity,
      weight: product.weight,
      weightSIUnit: product.weightSIUnit,
      productLife: product.productLife,
      productType: product.productType,
      productIsFoodItem: product.productIsFoodItem,
      keywords: product.keywords,
      ProductImage: product.productImage,
      variations: product.variations,
      sponsorTypeModel: [],
      stockEntries: [],


      // Add any other fields you want to store in Firestore
    });





    const newQuickProduct = new QuickProduct(MainproductData);
    await newQuickProduct.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



module.exports = { searchProducts, addProduct ,addProductBothQuickAndMain };
