const Category = require('../models/category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAllWithDocuments();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories', error: error.message });
  }
};