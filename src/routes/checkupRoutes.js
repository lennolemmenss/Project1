const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.get('/', async (req, res) => {
  try {
    const checkups = await prisma.checkup.findMany({
      include: {
        patient: true,
        doctor: true,
        checkupType: true,
      },
    });

    res.render('checkups', { checkups }); // Pass the checkups data to the view
  } catch (error) {
    console.error('Error fetching checkups:', error);
    res.status(500).send('Error fetching checkups');
  }
});



// GET checkup details
router.get('/:id/details', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch checkup details including associated patient, doctor, checkup type, and documents
    const checkup = await prisma.checkup.findUnique({
      where: { checkup_id: Number(id) },
      include: {
        patient: true,
        doctor: true,
        checkupType: true,
      },
    });

    // Fetch associated documents for the checkup
    const checkupDocuments = await prisma.checkupDocument.findMany({
      where: { checkup_id: Number(id) },
    });

    // Render checkupdetails view, passing the checkup and documents data
    res.render('checkupdetails', { checkup, checkupDocuments });
  } catch (error) {
    console.error('Error fetching checkup details:', error);
    res.status(500).send('Error fetching checkup details');
  }
});

// GET form to create a new checkup
router.get('/new', async (req, res) => {
  const patients = await prisma.patient.findMany();
  const doctors = await prisma.doctor.findMany();
  const checkupTypes = await prisma.checkupType.findMany();
  res.render('create-edit-checkups', { checkup: null, patients, doctors, checkupTypes });
});

// GET form to edit an existing checkup
router.get('/:id/edit', async (req, res) => {
  const { id } = req.params;
  const checkup = await prisma.checkup.findUnique({
    where: { checkup_id: Number(id) },
    include: {
      patient: true,
      doctor: true,
      checkupType: true,
    },
  });
  const patients = await prisma.patient.findMany();
  const doctors = await prisma.doctor.findMany();
  const checkupTypes = await prisma.checkupType.findMany();
  res.render('create-edit-checkups', { checkup, patients, doctors, checkupTypes });
});

// POST create a new checkup
router.post('/', async (req, res) => {
  const { patient_id, doctor_id, checkup_type_id, checkup_date, notes, status } = req.body;
  await prisma.checkup.create({
    data: {
      patient_id: Number(patient_id),
      doctor_id: Number(doctor_id),
      checkup_type_id: Number(checkup_type_id),
      checkup_date: new Date(checkup_date),
      notes,
      status,
    },
  });
  res.redirect('/checkups');
});

// PUT update an existing checkup
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, checkup_type_id, checkup_date, notes, status } = req.body;
  await prisma.checkup.update({
    where: { checkup_id: Number(id) },
    data: {
      patient_id: Number(patient_id),
      doctor_id: Number(doctor_id),
      checkup_type_id: Number(checkup_type_id),
      checkup_date: new Date(checkup_date),
      notes,
      status,
    },
  });
  res.redirect('/checkups');
});

// DELETE an existing checkup
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.checkup.delete({
    where: { checkup_id: Number(id) },
  });
  res.redirect('/checkups');
});

module.exports = router;
