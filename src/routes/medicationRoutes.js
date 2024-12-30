const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');

// Routes for Medication entity
router.post('/', medicationController.createMedication); // Create a new medication
router.get('/', medicationController.getAllMedications); // Get all medications
router.get('/:id', medicationController.getMedicationById); // Get medication by ID
router.put('/:id', medicationController.updateMedication); // Update medication by ID
router.delete('/:id', medicationController.deleteMedication); // Delete medication by ID

module.exports = router;
