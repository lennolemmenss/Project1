const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController'); // Import the Doctor controller

// Routes for Doctor entity
router.post('/', doctorController.createDoctor); // Create a new doctor
router.get('/', doctorController.getAllDoctors); // Get all doctors
router.get('/:id', doctorController.getDoctorById); // Get doctor by ID
router.put('/:id', doctorController.updateDoctor); // Update doctor by ID
router.delete('/:id', doctorController.deleteDoctor); // Delete doctor by ID

module.exports = router;
