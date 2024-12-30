const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');

// Routes for MedicalRecord entity
router.post('/', medicalRecordController.createMedicalRecord); // Create a new medical record
router.get('/', medicalRecordController.getAllMedicalRecords); // Get all medical records
router.get('/:id', medicalRecordController.getMedicalRecordById); // Get medical record by ID
router.put('/:id', medicalRecordController.updateMedicalRecord); // Update medical record by ID
router.delete('/:id', medicalRecordController.deleteMedicalRecord); // Delete medical record by ID

module.exports = router;
