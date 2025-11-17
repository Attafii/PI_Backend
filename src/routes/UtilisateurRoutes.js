const express = require('express');
const multer = require('multer');
const utilisateurController = require('../controllers/UtilisateurController');

const router = express.Router();

// Register a new user
router.post('/register', utilisateurController.registerUser);

// Login User
router.post('/login', utilisateurController.loginUser);


// forget-password
router.post('/forget-password', utilisateurController.forgotPassword);

// reset-password with token 
router.put('/reset-password/:token', utilisateurController.resetPassword);

// Get a list of all users
router.get('/users', utilisateurController.getAllUsers);
router.get('/specialites', utilisateurController.getAllSpecialities);
// get formateur
router.get('/users/formateurs', utilisateurController.getAllFormateurs);

// get candidat
router.get('/users/candidats', utilisateurController.getAllCandidats);
router.get('/users/candidatsTotal', utilisateurController.getCandidatsCount);
router.get('/users/formateursTotal', utilisateurController.getFormateursCount);
// get user by Email
router.get('/users/:email', utilisateurController.getUserByEmail);

// Get user by ID
router.get('/users/:id', utilisateurController.getUserById1);

// Update user by ID 
router.put('/users/update/:id', utilisateurController.updateUser);

router.delete('/users/delete/:id', utilisateurController.deleteUser);

module.exports = router;
