const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const productRoutes = require('./routes/productRoutes');
const billRoutes = require('./routes/billRoutes');
const quickProductRoutes = require('./routes/quickProductRoutes');

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
app.use('/api/upload', uploadRoutes);
app.use('/api/add', productRoutes);
app.use('/api', billRoutes);
app.use('/api', quickProductRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
