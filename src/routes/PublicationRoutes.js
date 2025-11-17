const express = require('express');
const publicationController = require('../controllers/PublicationController');

const router = express.Router();

// Route 1: Client pour créer une publication (POST /api/publications)
router.post('/publications', publicationController.createPublication);

// Route 2: Développeur pour postuler à une publication (POST /api/publications/:id/apply)
router.post('/publications/:id/apply', publicationController.applyToPublication);

// Route 3: Récupérer toutes les publications (GET /api/publications)
router.get('/publications', publicationController.getAllPublications);

// Route 4: Récupérer une publication par ID (GET /api/publications/:id)
router.get('/publications/:id', publicationController.getPublicationById);


module.exports = router;