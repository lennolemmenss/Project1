const express = require('express');
const router = express.Router();
const prescriptionMedicationController = require('../controllers/prescriptionMedicationController');

// Routes for PrescriptionMedication entity
router.post('/', prescriptionMedicationController.createPrescriptionMedication); // Create a new PrescriptionMedication
router.get('/', prescriptionMedicationController.getAllPrescriptionMedications); // Get all PrescriptionMedications
router.get('/:prescription_id/:medication_id', prescriptionMedicationController.getPrescriptionMedicationById); // Get PrescriptionMedication by IDs
router.put('/:prescription_id/:medication_id', prescriptionMedicationController.updatePrescriptionMedication); // Update PrescriptionMedication
router.delete('/:prescription_id/:medication_id', prescriptionMedicationController.deletePrescriptionMedication); // Delete PrescriptionMedication

module.exports = router;
