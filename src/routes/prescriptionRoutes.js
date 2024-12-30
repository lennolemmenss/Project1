const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

// Routes for Prescription entity
router.post('/', prescriptionController.createPrescription); // Create a new prescription
router.get('/', prescriptionController.getAllPrescriptions); // Get all prescriptions
router.get('/:id', prescriptionController.getPrescriptionById); // Get prescription by ID
router.put('/:id', prescriptionController.updatePrescription); // Update prescription by ID
router.delete('/:id', prescriptionController.deletePrescription); // Delete prescription by ID

module.exports = router;
