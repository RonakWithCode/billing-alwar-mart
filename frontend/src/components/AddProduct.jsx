import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';

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
    minSelectableQuantity: 1,
    maxSelectableQuantity: '',
    selectableQuantity: 1,
    weight: '',
    weightSIUnit: '',
    productLife: '',
    productType: '',
    productIsFoodItem: '',
    keywords: [],
    productImage: [],
    variations: [],
    SponsorHomeType: 'Home Screen None',
    SponsorSerachType: 'Serach Screen None',
    SponsorRecommendationType: 'Recommendation None',
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
    axios.get('http://localhost:5001/api/subcategories').then((response) => setSubCategories(response.data));


    const fetchCategories = async () => {
      try {
        // const fetchCat =  axios.get('http://localhost:5001/api/categories').then((response) => setCategories(response.data));

        // 

        const response = await axios.get('http://localhost:5001/api/categories');
        const CategoriesData = response.data.map((Category) => ({
          value: Category.name,
          label: (
            <div className="flex items-center">
              <img
                className="inline-block w-12 h-12  object-contain"
                src={Category.imageUri}
                alt={Category.name}
              />
              <span className="ml-2 text-black">{Category.name}</span>
            </div>
          ),
        }));
        setCategories(CategoriesData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };


    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/brands');
        const brandsData = response.data.map((brand) => ({
          value: brand.name,
          label: (
            <div className="flex items-center">
              <img
                className="inline-block w-12 h-12  object-contain"
                src={brand.imageUri}
                alt={brand.name}
              />
              <span className="ml-2 text-black">{brand.name}</span>
            </div>
          ),
        }));
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
    fetchCategories();

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



  // const handleImageChange = (e) => {
  //   setProduct({ ...product, productImage: Array.from(e.target.files) });
  // };



  const [images, setImages] = useState([]);



  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setImages([...images, ...newImages]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    }

  });

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const maxWidth = 800; // Set your desired max width
          const scaleSize = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            }));
          }, file.type, 0.7); // Adjust quality here
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // const productData = { ...product, productImage: imageUrls };
    console.log(product);
    try {
      const imageUrls = [];
      for (const file of images) {
        const compressedImage = await compressImage(file);

        const formData = new FormData();
        formData.append('file', compressedImage);
        const response = await axios.post('http://localhost:5001/api/upload/upload', formData);
        imageUrls.push(response.data.url);
      }

      const productData = { ...product, productImage: imageUrls };


      const response = await axios.post('http://localhost:5001/api/add/addproductbothquickandmain', productData);
      if (response.status === 201) {
        // setProduct({
        //   isAvailable: true,
        //   productId: '',
        //   productName: '',
        //   productDescription: '',
        //   Barcode: '',
        //   brand: '',
        //   category: '',
        //   subCategory: '',
        //   price: '',
        //   mrp: '',
        //   discount: '',
        //   stockCount: '',
        //   minSelectableQuantity: '',
        //   maxSelectableQuantity: '',
        //   selectableQuantity: '',
        //   weight: '',
        //   weightSIUnit: '',
        //   productLife: '',
        //   productType: '',
        //   productIsFoodItem: '',
        //   keywords: [],
        //   productImage: [],
        //   variations: [],
        // });
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



  // Start Variations

  const [isVariationsOn, setIsVariationsOn] = useState(false);
  const [isVariationsColorOn, setIsVariationsColorOn] = useState(false);
  const [isVariationsSizeOn, setIsVariationsSizeOn] = useState(false);

  const [variationId, setVariationId] = useState('');
  const [variationSize, setVariationSize] = useState('');
  const [variationColor, setVariationColor] = useState('');

  const handleVariationsOn = () => setIsVariationsOn(!isVariationsOn);
  const handleVariationsColorOn = () => setIsVariationsColorOn(!isVariationsColorOn);
  const handleVariationsSizeOn = () => setIsVariationsSizeOn(!isVariationsSizeOn);

  const handleAddVariation = () => {

    if (variationId == "") {
      return;
    }
    if (variationSize == "" && variationColor == "") {
      return;
    }



    const newVariation = {
      id: variationId,
      size: isVariationsSizeOn ? variationSize : null,
      color: isVariationsColorOn ? variationColor : null,
    };

    setProduct((prevProduct) => ({
      ...prevProduct,
      variations: [...prevProduct.variations, newVariation],
    }));
    setVariationId('');
    setVariationSize('');
    setVariationColor('');
  };


  const handleRemoveVariation = (index) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      variations: prevProduct.variations.filter((_, i) => i !== index),
    }));
  };



  // End Variations




  // Start Sponsors


  const SponsorHomeType = [
    'Home Screen None',
    'Home Screen high',
    'Home Screen median',
    'Home Screen low',
  ];

  const SponsorSerachType = [
    'Serach Screen None',
    'Serach Screen high',
    'Serach Screen median',
    'Serach Screen low',
  ];
  const SponsorRecommendationType = [
    'Recommendation None',
    'Recommendation high',
    'Recommendation median',
    'Recommendation low',
  ];

  // End Sponsors


  // Start si unit 



  const [unit, setUnit] = useState('');
  const handleUnitChange = (e) => {
    setUnit(e.target.value);
    setProduct({
      ...product,
      weightSIUnit: e.target.value,
    });
  };


  const Siunit = [
    'kg',
    "L",
    "litres",
    "ml",
    "pack",
    'g',
    'kg',
  ]

  // end si unit


  // product life 
  const [productlife, setProductlife] = useState('');
  const productlifeUnit = [
    "1 month",
    "2 month",
    '3 month',
    "6 months",
    "7 months",
    "8 months",
    "9 months",
    "10 months",
    "11 months",
    "12 month",
    "1 year",
    "2 year",
    "3 year",
    "5 year",
    "6 year",
    '1 day',
    '2 day',
    '3 day',
    '4 day',
    '5 day',
    '6 day',
    '7 day',
    '8 day',
    "24 hour",
    "5 hour",
    "10 hour",
    "15 hour",
    "20 hour",
    "25 hour",
    "30 hour",
  ]

  // end product life



  //  ProductType start
  const ProductType = [
    'Home',
    'kitchen',
    'grocery',
    'vegetables',
    'fruits',
  ];

  // end ProductType



  // Product is food type
  const ProductIsFoodType = [
    'Fruit',
    'Vegetable',
    'Vegfood',
    'NonVegFood',
    'notFood'
  ];


  // end Product is food type




    //  Keyboard
    const [keyword, setKeyword] = useState('');
    const handleAddKeyword = () => {
      const keywordTrimmedLower = keyword.trim().toLocaleLowerCase();
      if (keywordTrimmedLower !== '') {
        const newKeywords = [];
        for (let i = 1; i <= keywordTrimmedLower.length; i++) {
          const subStringText = keywordTrimmedLower.substring(0, i);
          newKeywords.push(subStringText);
        }
        setProduct((prevProduct) => ({
          ...prevProduct,
          keywords: [...new Set([...prevProduct.keywords, ...newKeywords])],
        }));
        setKeyword('');
      }
    };
    const handleDeleteKeyword = (index) => {
      setProduct((prevProduct) => ({
        ...prevProduct,
        keywords: prevProduct.keywords.filter((_, i) => i !== index),
      }));
    };
  
  
    //  End Keyboard

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

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            name="productDescription"
            value={product.productDescription}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"

          />
        </div>

        <div>
          <label>Barcode:</label>
          <input type="text" name="Barcode" value={product.Barcode} onChange={handleChange} onKeyPress={handleBarcodeKeyPress} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Brand:</label>

          <Select
            options={brands}
            classNamePrefix="custom-select"
            placeholder="Select brand..."
            isSearchable
            onChange={(selectBrand) => {
              console.log(selectBrand);
              setProduct((prevProduct) => ({
                ...prevProduct,
                brand: selectBrand.value,
              }));
            }}
            name="brand"
            styles={{
              control: (base) => ({
                ...base,
                padding: '0rem',
                marginTop: '0rem',
                marginVertical: '0rem',
                marginHorizontal: '0rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                backgroundColor: '#fff',
                '&:hover': {
                  borderColor: '#60A5FA',
                },
                '&:focus': {
                  borderColor: '#60A5FA',
                  boxShadow: '0 0 0 1px #60A5FA',
                },
              }),

              menu: (base) => ({
                ...base,
                marginTop: '0rem',
                padding: '0rem',
                marginVertical: '0rem',
                marginHorizontal: '0rem',
                borderRadius: '0.5rem',
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
              }),
              option: (base, state) => ({
                ...base,
                marginTop: '0rem',
                padding: '0rem',
                marginVertical: '0rem',
                cursor: 'pointer',
                marginHorizontal: '0rem',
                backgroundColor: state.isFocused ? '#F3F4F6' : '#fff',
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                },
              }),
            }}
          />
          <h3 onClick={() => setShowBrandModal(true)} className='text-blue-600 hover:text-blue-400 ml-2 text-xl hover:cursor-pointer' >add new Brand</h3>

        </div>
        <div>
          <label>Category:</label>
          <Select
            options={categories}
            classNamePrefix="custom-select"
            placeholder="Select Category..."
            isSearchable
            name="category"
            onChange={(selectCategory) => {
              setProduct((prevProduct) => ({
                ...prevProduct,
                category: selectCategory.value,
              }));
            }}
            styles={{
              control: (base) => ({
                ...base,
                padding: '0rem',
                marginTop: '0rem',
                marginVertical: '0rem',
                marginHorizontal: '0rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                backgroundColor: '#fff',
                '&:hover': {
                  borderColor: '#60A5FA',
                },
                '&:focus': {
                  borderColor: '#60A5FA',
                  boxShadow: '0 0 0 1px #60A5FA',
                },
              }),

              menu: (base) => ({
                ...base,
                marginTop: '0rem',
                padding: '0rem',
                marginVertical: '0rem',
                marginHorizontal: '0rem',
                borderRadius: '0.5rem',
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
              }),
              option: (base, state) => ({
                ...base,
                marginTop: '0rem',
                padding: '0rem',
                marginVertical: '0rem',
                cursor: 'pointer',
                marginHorizontal: '0rem',
                backgroundColor: state.isFocused ? '#F3F4F6' : '#fff',
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                },
              }),
            }}
          />
          <h3 onClick={() => setShowCategoryModal(true)} className='text-blue-600 ml-2 text-xl hover:text-blue-400 hover:cursor-pointer' >add new Category</h3>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Weight SI Unit</label>
            <input
              type="text"
              id="size-weight-unit-label"
              name="weightSIUnit"
              value={product.weightSIUnit}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              required
            />

            <select
              id="size-weight-unit"
              value={unit}
              onChange={handleUnitChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="" disabled>
                Select unit
              </option>
              {Siunit.map((unit, index) => (
                <option key={index} value={unit}>
                  {unit}
                </option>
              ))}
            </select>

          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Product Life</label>
            <input
              type="text"
              id="productLife"
              name="productLife"
              value={product.productLife}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />

            <select
              id="product-select"
              value={productlife}
              onChange={(select) => {
                setProductlife(select.target.value);
                setProduct({
                  ...product,
                  productLife: select.target.value
                })
              }}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="" disabled>
                Select Product life
              </option>
              {productlifeUnit.map((productlife, index) => (
                <option key={index} value={productlife}>
                  {productlife}
                </option>
              ))}
            </select>

          </div>
          <div>
            <label>Product Type:</label>
            <select
              name="productType"
              value={product.productType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required>
              <option value="" disabled>Select Product Type</option>
              {ProductType.map((productType) => (
                <option key={productType} value={productType}>
                  {productType}
                </option>
              ))}
            </select>

          </div>
          <div>
          <label>Product is food Type:</label>

            <select
              name='productIsFoodItem'
              value={product.productIsFoodItem}
              onChange={(select) => {
                setProduct({
                  ...product,
                  productIsFoodItem: select.target.value
                })
              }}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="" disabled>
                Select Food Item
              </option>
              {ProductIsFoodType.map((productfood, index) => (
                <option key={index} value={productfood}>
                  {productfood}
                </option>
              ))}
            </select>


          </div>
          <div>
          </div>

        </div>
        <div className="mb-4 mt-6">
              <label className="block text-gray-700 mb-1">Keyword</label>
              <div className="flex">
                <input
                  type="text"
                  name="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mr-2"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Add Keyword
                </button>
              </div>
            </div>

            {product.keywords.length > 0 && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Keywords</label>
                <ul className="list-disc pl-5">
                  {product.keywords.map((keyword, index) => (
                    <li key={index} className="flex justify-between items-center mb-1">
                      <span>{keyword}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteKeyword(index)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}


     
     
     
     
     
     
        <div>
          <div {...getRootProps()} className="border-dashed border-4 border-gray-300 p-10 text-center cursor-pointer">
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          <div className="flex flex-wrap mt-4">
            {images.map((img, index) => (
              <div key={index} className="w-32 h-32 p-1 relative">
                <img src={img.preview} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                <button
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                  onClick={() => handleRemoveImage(index)}
                >
                  x
                </button>
              </div>
            ))}
          </div>

        </div>




        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={isVariationsOn} onChange={handleVariationsOn} className="form-checkbox h-4 w-4 rounded-full text-green-600" />
            <span>Have variations</span>
          </label>
          {isVariationsOn && (
            <div id='variationsDiv' className="mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Variations Product Id</label>
                <input
                  type="text"
                  name="variationsId"
                  value={variationId}
                  onChange={(e) => setVariationId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
                <label className="flex items-center space-x-1">
                  <input type="checkbox" checked={isVariationsSizeOn} onChange={handleVariationsSizeOn} className="form-checkbox h-4 rounded-full text-green-600" />
                  <span>Size</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input type="checkbox" checked={isVariationsColorOn} onChange={handleVariationsColorOn} className="form-checkbox h-4 rounded-full text-green-600" />
                  <span>Colour</span>
                </label>

                {isVariationsSizeOn && (
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Variations Size</label>
                    <input
                      type="text"
                      name="variationsSize"
                      value={variationSize}
                      onChange={(e) => setVariationSize(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                )}
                {isVariationsColorOn && (
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Variations Color</label>
                    <input
                      type="text"
                      name="variationsColor"
                      value={variationColor}
                      onChange={(e) => setVariationColor(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                )}
              </div>

              <div className='content-end items-end justify-end '>
                <button
                  type="button"
                  onClick={handleAddVariation}
                  className="bg-blue-500 hover:bg-blue-300 text-white py-2 px-2 rounded"
                >
                  Add Variations
                </button>
              </div>

              <div className="mt-4">
                <h3 className="text-gray-700 mb-2">Current Variations:</h3>
                <ul>
                  {product.variations.map((variation, index) => (
                    <li key={index} className="flex justify-between items-center border p-2 rounded mb-2">
                      <div>
                        <p>ID: {variation.id}</p>
                        {variation.size && <p>Size: {variation.size}</p>}
                        {variation.color && <p>Color: {variation.color}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariation(index)}
                        className="bg-red-500 hover:bg-red-300 text-white py-1 px-2 rounded"
                      >
                        Remove
                      </button>
                      {/* </ShieldCloseIcon> */}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className='space-y-2'>
          <label>Sponsor Home Type</label>
          <select
            name="SponsorHomeType"
            value={product.SponsorHomeType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required>
            {SponsorHomeType.map((sponsorHomeType) => (
              <option key={sponsorHomeType} value={sponsorHomeType}>
                {sponsorHomeType}
              </option>
            ))}
          </select>

          <label>Sponsor Search Type</label>
          <select
            name="SponsorSerachType"
            value={product.SponsorSerachType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required>
            {SponsorSerachType.map((sponsorSerachType) => (
              <option key={sponsorSerachType} value={sponsorSerachType}>
                {sponsorSerachType}
              </option>
            ))}
          </select>

          <label >Sponsor Recommendation Type</label>
          <select
            name="SponsorRecommendationType"
            value={product.SponsorRecommendationType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required>
            {SponsorRecommendationType.map((sponsorRecommendationType) => (
              <option key={sponsorRecommendationType} value={sponsorRecommendationType}>
                {sponsorRecommendationType}
              </option>
            ))}
          </select>
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
