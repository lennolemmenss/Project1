const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST route to create a new patient
router.post('/patients', async (req, res) => {
  try {
    const { first_name, last_name, email, contact_number, date_of_birth, address } = req.body;

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
      },
    });

    res.redirect('/patients');
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).send('Something went wrong');
  }
});

// Show the form to create a new patient
router.get('/patients/new', (req, res) => {
  res.render('create-edit-patient', { patient: null });
});

// Show the form to edit an existing patient
router.get('/patients/:id/edit', async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { patient_id: parseInt(req.params.id) },
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

// PUT route to update a patient
router.put('/patients/:id', async (req, res) => {
  try {
    const { first_name, last_name, email, contact_number, date_of_birth, address } = req.body;

    // Update patient data
    const updatedPatient = await prisma.patient.update({
      where: { patient_id: parseInt(req.params.id) },
      data: {
        first_name,
        last_name,
        email,
        contact_number,
        date_of_birth: new Date(date_of_birth),
        address,
      },
    });

    res.redirect('/patients');
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).send('Something went wrong');
  }
});

// DELETE patient
router.delete('/patients/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.patient.delete({
        where: { patient_id: parseInt(id) }, // Ensure patient_id is parsed as an integer
      });
      res.redirect('/patients'); // Redirect to the patients page after deletion
    } catch (error) {
      console.error('Error deleting patient:', error);
      res.status(500).send('Error deleting patient');
    }
  });

module.exports = router;
