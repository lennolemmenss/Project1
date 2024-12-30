// src/routes/checkupRoutes.js

const express = require('express');
const router = express.Router();
const checkupController = require('../controllers/checkupController'); // Import controller

// Define your checkup routes here
router.post('/', checkupController.createCheckup); // Create checkup
router.get('/', checkupController.getAllCheckups); // Get all checkups
router.get('/:id', checkupController.getCheckupById); // Get checkup by ID
router.put('/:id', checkupController.updateCheckup); // Update checkup
router.delete('/:id', checkupController.deleteCheckup); // Delete checkup

module.exports = router;
