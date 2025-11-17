const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const categorieController = require('../controllers/CategorieController'); 

const router = express.Router();

// Add Category
router.post('/create', categorieController.addCategory);

// Get Categories
router.get('/categories', categorieController.getAllCategory);

// Get Category by ID
router.get('/categories/:id', categorieController.getCategoryById);

// // Get Category by Name
// router.get('/getCategoryByName/:nom', categorieController.getCategoryByName);

// Update Category by ID
router.put('/categories/update/:id', categorieController.updateCategory);

// Delete Category by ID
router.delete('/categories/delete/:id', categorieController.deleteCategory);

module.exports = router;