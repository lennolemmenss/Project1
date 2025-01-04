// templates.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Homepage
router.get('/', (req, res) => {
  res.redirect('/dashboard');
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

router.get('/medication', (req, res) => {
  res.render('medication');
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

