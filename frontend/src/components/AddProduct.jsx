import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [product, setProduct] = useState({
    isAvailable: true,
    productId: '',
    productName: '',
    productDescription: '',
    Barcode: '',
    brand: '',
    category: '',
    subCategory: '',
    price: '',
    mrp: '',
    discount: '',
    stockCount: '',
    minSelectableQuantity: '',
    maxSelectableQuantity: '',
    selectableQuantity: '',
    weight: '',
    weightSIUnit: '',
    productLife: '',
    productType: '',
    productIsFoodItem: '',
    keywords: [],
    productImage: [],
    variations: [],
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);

  const [newBrand, setNewBrand] = useState({ name: '', image: '' });
  const [newCategory, setNewCategory] = useState({ name: '', image: '' });
  const [newSubCategory, setNewSubCategory] = useState({ name: '' });

  useEffect(() => {
    axios.get('http://localhost:5001/api/categories').then((response) => setCategories(response.data));
    axios.get('http://localhost:5001/api/subcategories').then((response) => setSubCategories(response.data));
    axios.get('http://localhost:5001/api/brands').then((response) => setBrands(response.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleBarcodeKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Focus on the next input field if needed
    }
  };


  const handleImageChange = (e) => {
    setProduct({ ...product, productImage: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrls = [];
    for (const file of product.productImage) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:5001/api/upload/upload', formData);
      imageUrls.push(response.data.url);
    }
    const productData = { ...product, productImage: imageUrls };
    try {
// http://localhost:5001/api/products\
// axios.get(`http://localhost:5001/api/add/products/search?query=${searchQuery}`)
      const response = await axios.post('http://localhost:5001/api/add/addproductbothquickandmain', productData);
      if (response.status === 201) {
        setProduct({
          isAvailable: true,
          productId: '',
          productName: '',
          productDescription: '',
          Barcode: '',
          brand: '',
          category: '',
          subCategory: '',
          price: '',
          mrp: '',
          discount: '',
          stockCount: '',
          minSelectableQuantity: '',
          maxSelectableQuantity: '',
          selectableQuantity: '',
          weight: '',
          weightSIUnit: '',
          productLife: '',
          productType: '',
          productIsFoodItem: '',
          keywords: [],
          productImage: [],
          variations: [],
        });
      } else {
        console.error('Failed to save product');
      }
    } catch (error) {
      console.error('Error:', error.response.data.message);
    }
  };

  const handleAddBrand = async () => {
    const formData = new FormData();
    formData.append('name', newBrand.name);
    formData.append('image', newBrand.image);

    const response = await axios.post('http://localhost:5001/api/brands', formData);

    if (response.status === 201) {
      setBrands([...brands, response.data]);
      setNewBrand({ name: '', image: '' });
      setShowBrandModal(false);
    } else {
      console.error('Failed to add brand');
    }
  };

  const handleAddCategory = async () => {
    const formData = new FormData();
    formData.append('name', newCategory.name);
    formData.append('image', newCategory.image);

    const response = await axios.post('http://localhost:5001/api/categories', formData);

    if (response.status === 201) {
      setCategories([...categories, response.data]);
      setNewCategory({ name: '', image: '' });
      setShowCategoryModal(false);
    } else {
      console.error('Failed to add category');
    }
  };

  const handleAddSubCategory = async () => {
    const response = await axios.post('http://localhost:5001/api/subcategories', newSubCategory);

    if (response.status === 201) {
      setSubCategories([...subCategories, response.data]);
      setNewSubCategory({ name: '' });
      setShowSubCategoryModal(false);
    } else {
      console.error('Failed to add subcategory');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Product ID:</label>
          <input type="text" name="productId" value={product.productId} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Product Name:</label>
          <input type="text" name="productName" value={product.productName} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Product Description:</label>
          <input type="text" name="productDescription" value={product.productDescription} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Barcode:</label>
          <input type="text" name="Barcode" value={product.Barcode} onChange={handleChange} onKeyPress={handleBarcodeKeyPress} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Brand:</label>
          <div className="flex items-center">
            <select name="brand" value={product.brand} onChange={handleChange} className="border p-2 rounded w-full">
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand.name}>{brand.name}</option>
              ))}
            </select>
            <button type="button" onClick={() => setShowBrandModal(true)} className="ml-2 p-2 bg-blue-500 text-white rounded">Add Brand</button>
          </div>
        </div>
        <div>
          <label>Category:</label>
          <div className="flex items-center">
            <select name="category" value={product.category} onChange={handleChange} className="border p-2 rounded w-full">
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>{category.name}</option>
              ))}
            </select>
            <button type="button" onClick={() => setShowCategoryModal(true)} className="ml-2 p-2 bg-blue-500 text-white rounded">Add Category</button>
          </div>
        </div>
        <div>
          <label>Sub-Category:</label>
          <div className="flex items-center">
            <select name="subCategory" value={product.subCategory} onChange={handleChange} className="border p-2 rounded w-full">
              <option value="">Select Sub-Category</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory.name}>{subCategory.name}</option>
              ))}
            </select>
            <button type="button" onClick={() => setShowSubCategoryModal(true)} className="ml-2 p-2 bg-blue-500 text-white rounded">Add Sub-Category</button>
          </div>
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>MRP:</label>
          <input type="number" name="mrp" value={product.mrp} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Discount:</label>
          <input type="number" name="discount" value={product.discount} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Stock Count:</label>
          <input type="number" name="stockCount" value={product.stockCount} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Min Selectable Quantity:</label>
          <input type="number" name="minSelectableQuantity" value={product.minSelectableQuantity} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Max Selectable Quantity:</label>
          <input type="number" name="maxSelectableQuantity" value={product.maxSelectableQuantity} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Selectable Quantity:</label>
          <input type="number" name="selectableQuantity" value={product.selectableQuantity} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Weight:</label>
          <input type="text" name="weight" value={product.weight} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Weight SI Unit:</label>
          <input type="text" name="weightSIUnit" value={product.weightSIUnit} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Product Life:</label>
          <input type="text" name="productLife" value={product.productLife} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Product Type:</label>
          <input type="text" name="productType" value={product.productType} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Product is Food Item:</label>
          <input type="text" name="productIsFoodItem" value={product.productIsFoodItem} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Keywords:</label>
          <input type="text" name="keywords" value={product.keywords.join(', ')} onChange={(e) => setProduct({ ...product, keywords: e.target.value.split(',').map((keyword) => keyword.trim()) })} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Product Images:</label>
          <input type="file" name="productImage" onChange={handleImageChange} multiple className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Variations:</label>
          <input type="text" name="variations" value={product.variations.map(variation => variation.name).join(', ')} onChange={(e) => setProduct({ ...product, variations: e.target.value.split(',').map((name) => ({ id: Date.now().toString(), name: name.trim(), weightWithSIUnit: '' })) })} className="border p-2 rounded w-full" />
        </div>
        <button type="submit" className="p-2 bg-green-500 text-white rounded">Add Product</button>
      </form>

      {/* Brand Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded w-96">
            <h2 className="text-xl mb-4">Add Brand</h2>
            <div className="mb-4">
              <label>Brand Name:</label>
              <input type="text" value={newBrand.name} onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })} className="border p-2 rounded w-full" />
            </div>
            <div className="mb-4">
              <label>Brand Image:</label>
              <input type="file" onChange={(e) => setNewBrand({ ...newBrand, image: e.target.files[0] })} className="border p-2 rounded w-full" />
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowBrandModal(false)} className="p-2 bg-gray-500 text-white rounded">Cancel</button>
              <button onClick={handleAddBrand} className="p-2 bg-blue-500 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded w-96">
            <h2 className="text-xl mb-4">Add Category</h2>
            <div className="mb-4">
              <label>Category Name:</label>
              <input type="text" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className="border p-2 rounded w-full" />
            </div>
            <div className="mb-4">
              <label>Category Image:</label>
              <input type="file" onChange={(e) => setNewCategory({ ...newCategory, image: e.target.files[0] })} className="border p-2 rounded w-full" />
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowCategoryModal(false)} className="p-2 bg-gray-500 text-white rounded">Cancel</button>
              <button onClick={handleAddCategory} className="p-2 bg-blue-500 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Category Modal */}
      {showSubCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded w-96">
            <h2 className="text-xl mb-4">Add Sub-Category</h2>
            <div className="mb-4">
              <label>Sub-Category Name:</label>
              <input type="text" value={newSubCategory.name} onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })} className="border p-2 rounded w-full" />
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowSubCategoryModal(false)} className="p-2 bg-gray-500 text-white rounded">Cancel</button>
              <button onClick={handleAddSubCategory} className="p-2 bg-blue-500 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
