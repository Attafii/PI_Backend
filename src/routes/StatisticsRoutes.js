const express = require('express');
const statiscticsController = require('../controllers/StatisticsController');

const router = express.Router();

// get candidat count
// router.get('/users/candidatsTotal', statiscticsController.getCandidatsCount); 

// get candidat count
// router.get('/users/formateursTotal', statiscticsController.getFormateursCount); 

// get candidat count
router.get('/users/getSessionsByFormation', statiscticsController.getSessionsByFormation); 

// get candidat count
router.get('/users/getSessionsByFormateur', statiscticsController.getSessionsByFormateur); 
module.exports = router;
