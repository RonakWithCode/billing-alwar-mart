const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const productRoutes = require('./routes/productRoutes');  // Add this line

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/AlwarMart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/upload', uploadRoutes); // Ensure this matches the route
app.use('/api/add', productRoutes);  // Add this line
// const response = await axios.post('http://localhost:5001/api/add/products', productData);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
