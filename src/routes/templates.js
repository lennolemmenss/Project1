// templates.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Dashboard
router.get('/dashboard', (req, res) => {
  res.render('dashboard');
});


// Patients
router.get('/patients', async (req, res) => {
  try {
    // Fetch all patients from the database
    const patients = await prisma.patient.findMany();

    // Render the patients.ejs page and pass the patients data
    res.render('patient', { patients: patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Patient Details Route
router.get('/patients/:id', async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    
    if (isNaN(patientId)) {
      return res.status(400).send('Invalid patient ID');
    }

    const patient = await prisma.patient.findUnique({
      where: {
        patient_id: patientId
      }
    });

    if (!patient) {
      return res.status(404).send('Patient not found');
    }

    res.render('patientDetails', { patient });
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).send('Error fetching patient details');
  }
});

router.get('/patients/new', (req, res) => {
  res.render('create-edit-patient', { patient: null }); // Pass patient as null
});


// Checkups
router.get('/checkups', (req, res) => {
  res.render('checkups');
});

// Export Data
router.get('/export', (req, res) => {
  res.render('export');
});

// Login
router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;

