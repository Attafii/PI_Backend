const express = require('express');
const InscritSessionController = require('../controllers/InscritSessionController');

const router = express.Router();

// Ajouter une formation
router.post('/candidats/subscribe', InscritSessionController.assisterSession);

module.exports = router;
