const express = require('express');
const formationController = require('../controllers/FormationController');

const router = express.Router();

// Ajouter une formation
router.post('/formations/addFormation', formationController.addFormation);
// router.post('/download/:fileName', formationController.download);
// Récupérer toutes les formations
router.get('/formations', formationController.getAllFormations);
router.get('/formations/countByCategory', formationController.getFormationsCountByCategory);
// Récupérer une formation par ID
router.get('/formations/:id', formationController.getFormationById);

// // Mettre à jour une formation
// router.put('/formations/update/:id', formationController.updateFormation);

// Supprimer une formation
router.delete('/formations/delete/:id', formationController.deleteFormation);

module.exports = router;
