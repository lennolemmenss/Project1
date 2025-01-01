const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Show all patients
router.get('/', async (req, res) => {
  try {
    const patients = await prisma.patient.findMany();
    res.render('patient', { patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Show the form to create a new patient - this must come BEFORE /:id route
router.get('/new', (req, res) => {
  res.render('create-edit-patient', { patient: null });
});

// Show the form to edit an existing patient
router.get('/:id/edit', async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    if (isNaN(patientId)) {
      return res.status(400).send('Invalid patient ID');
    }

    const patient = await prisma.patient.findUnique({
      where: { patient_id: patientId },
    });

    if (!patient) {
      return res.status(404).send('Patient not found');
    }

    res.render('create-edit-patient', { patient });
  } catch (error) {
    console.error('Error fetching patient for editing:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Show patient details
router.get('/:id', async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    if (isNaN(patientId)) {
      return res.status(400).send('Invalid patient ID');
    }

    const patient = await prisma.patient.findUnique({
      where: { patient_id: patientId },
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

// Create new patient
router.post('/', async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      email, 
      contact_number, 
      date_of_birth, 
      address,
      condition_status 
    } = req.body;

    // Check if email already exists
    const existingPatient = await prisma.patient.findUnique({ where: { email } });
    if (existingPatient) {
      return res.status(400).send('Email already exists');
    }

    // Create a new patient
    await prisma.patient.create({
      data: {
        first_name,
        last_name,
        email,
        contact_number,
        date_of_birth: new Date(date_of_birth),
        address,
        condition_status: condition_status || 'active', // Use provided status or default to 'active'
      },
    });

    res.redirect('/patients');
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).send('Something went wrong');
  }
});

// Update patient
router.put('/:id', async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    if (isNaN(patientId)) {
      return res.status(400).send('Invalid patient ID');
    }

    const { 
      first_name, 
      last_name, 
      email, 
      contact_number, 
      date_of_birth, 
      address,
      condition_status 
    } = req.body;

    const updatedPatient = await prisma.patient.update({
      where: { patient_id: patientId },
      data: {
        first_name,
        last_name,
        email,
        contact_number,
        date_of_birth: new Date(date_of_birth),
        address,
        condition_status,
      },
    });

    res.redirect('/patients');
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).send('Something went wrong');
  }
});

// Delete patient
router.delete('/:id', async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    if (isNaN(patientId)) {
      return res.status(400).send('Invalid patient ID');
    }

    await prisma.patient.delete({
      where: { patient_id: patientId },
    });
    res.redirect('/patients');
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).send('Error deleting patient');
  }
});

module.exports = router;