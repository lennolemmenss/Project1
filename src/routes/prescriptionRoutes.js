const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Display form to create a new prescription
router.get('/patients/:patientId/prescriptions/new', async (req, res) => {
  const { patientId } = req.params;

  try {
    const patient = await prisma.patient.findUnique({
      where: { patient_id: parseInt(patientId) },
    });

    if (!patient) {
      return res.status(404).send('Patient not found');
    }

    res.render('create-edit-prescription', {
      action: 'create',
      patient,
      prescription: null, // Pass null for new prescriptions
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create a new prescription
router.post('/patients/:patientId/prescriptions', async (req, res) => {
  const { patientId } = req.params;
  const { doctor_id, prescribed_date, valid_until, notes } = req.body;

  try {
    await prisma.prescription.create({
      data: {
        patient_id: parseInt(patientId),
        doctor_id: parseInt(doctor_id),
        prescribed_date: new Date(prescribed_date),
        valid_until: new Date(valid_until),
        notes,
      },
    });

    res.redirect(`/patients/${patientId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Display form to edit an existing prescription
router.get('/prescriptions/:prescriptionId/edit', async (req, res) => {
  const { prescriptionId } = req.params;

  try {
    const prescription = await prisma.prescription.findUnique({
      where: { prescription_id: parseInt(prescriptionId) },
      include: { patient: true, doctor: true },
    });

    if (!prescription) {
      return res.status(404).send('Prescription not found');
    }

    res.render('create-edit-prescription', {
      action: 'edit',
      patient: prescription.patient,
      prescription,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update an existing prescription
router.put('/prescriptions/:prescriptionId', async (req, res) => {
  const { prescriptionId } = req.params;
  const { doctor_id, prescribed_date, valid_until, notes } = req.body;

  try {
    await prisma.prescription.update({
      where: { prescription_id: parseInt(prescriptionId) },
      data: {
        doctor_id: parseInt(doctor_id),
        prescribed_date: new Date(prescribed_date),
        valid_until: new Date(valid_until),
        notes,
      },
    });

    const prescription = await prisma.prescription.findUnique({
      where: { prescription_id: parseInt(prescriptionId) },
    });

    res.redirect(`/patients/${prescription.patient_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
