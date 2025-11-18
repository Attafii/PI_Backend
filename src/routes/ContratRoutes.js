const express = require('express');
const router = express.Router();
const {
  createContrat,
  getContratById,
  getClientContrats,
  getFreelanceContrats,
  signContrat,
  updateContratStatus,
  updateMilestone,
  addNote
} = require('../controllers/ContratController');

// Create a new contract
router.post('/', createContrat);

// Get contract by ID
router.get('/:id', getContratById);

// Get all contracts for a client
router.get('/client/:clientId', getClientContrats);

// Get all contracts for a freelancer
router.get('/freelance/:freelanceId', getFreelanceContrats);

// Sign a contract
router.put('/:id/sign', signContrat);

// Update contract status
router.put('/:id/status', updateContratStatus);

// Update milestone status
router.put('/:id/milestones/:milestoneId', updateMilestone);

// Add note to contract
router.post('/:id/notes', addNote);

module.exports = router;
