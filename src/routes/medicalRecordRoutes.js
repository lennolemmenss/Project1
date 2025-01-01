const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Display form to create a new medical record
router.get('/patients/:patientId/medical-records/new', async (req, res) => {
    const { patientId } = req.params;
  
    try {
      const patient = await prisma.patient.findUnique({
        where: { patient_id: parseInt(patientId) },
      });
  
      if (!patient) {
        return res.status(404).send('Patient not found');
      }
  
      res.render('create-edit-medicalR', {
        action: 'create',
        patient,
        medicalRecord: null, // Pass null for new medical records
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
// Create a new medical record
router.post('/patients/:patientId/medical-records', async (req, res) => {
  const { patientId } = req.params;
  const { disease_name, diagnosis_date, status, notes } = req.body;

  try {
    await prisma.medicalRecord.create({
      data: {
        patient_id: parseInt(patientId),
        disease_name,
        diagnosis_date: new Date(diagnosis_date),
        status,
        notes,
      },
    });

    res.redirect(`/patients/${patientId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Display form to edit an existing medical record
router.get('/medical-records/:recordId/edit', async (req, res) => {
    const { recordId } = req.params;
  
    try {
      const record = await prisma.medicalRecord.findUnique({
        where: { record_id: parseInt(recordId) },
        include: { patient: true },
      });
  
      if (!record) {
        return res.status(404).send('Medical record not found');
      }
  
      res.render('create-edit-medicalR', {
        action: 'edit',
        patient: record.patient,
        medicalRecord: record, // Pass the medical record data
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

// Update an existing medical record
router.put('/medical-records/:recordId', async (req, res) => {
    const { recordId } = req.params;
    const { disease_name, diagnosis_date, status, notes } = req.body;
  
    try {
      await prisma.medicalRecord.update({
        where: { record_id: parseInt(recordId) },
        data: {
          disease_name,
          diagnosis_date: new Date(diagnosis_date),
          status,
          notes,
        },
      });
  
      const record = await prisma.medicalRecord.findUnique({
        where: { record_id: parseInt(recordId) },
      });
  
      res.redirect(`/patients/${record.patient_id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  

module.exports = router;
