const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Multer configuration for file upload
const upload = multer({
  dest: 'uploads/', // Folder to save the uploaded files
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('application/')) {
      return cb(new Error('Only image and document files are allowed.'));
    }
    cb(null, true);
  }
});

// GET all checkups
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

// POST create a new checkup, including document upload
router.post('/', upload.single('document'), async (req, res) => {
  const { patient_id, doctor_id, checkup_type_id, checkup_date, notes, status } = req.body;
  let documentData = null;

  // If there is a file, save the document to CheckupDocument
  if (req.file) {
    documentData = {
      file_name: req.file.originalname,
      file_path: path.join(__dirname, '..', req.file.path), // Store file path
      file_type: req.file.mimetype,
    };
  }

  // Create the checkup in the database
  const newCheckup = await prisma.checkup.create({
    data: {
      patient_id: Number(patient_id),
      doctor_id: Number(doctor_id),
      checkup_type_id: Number(checkup_type_id),
      checkup_date: new Date(checkup_date),
      notes,
      status,
    },
  });

  // If a document was uploaded, associate it with the checkup
  if (documentData) {
    await prisma.checkupDocument.create({
      data: {
        checkup_id: newCheckup.checkup_id,
        file_name: documentData.file_name,
        file_path: documentData.file_path,
        file_type: documentData.file_type,
      },
    });
  }

  res.redirect(`/checkups`);
});

// PUT update an existing checkup, including document upload
router.put('/:id', upload.single('document'), async (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, checkup_type_id, checkup_date, notes, status } = req.body;
  let documentData = null;

  if (req.file) {
    documentData = {
      file_name: req.file.originalname,
      file_path: path.join(__dirname, '..', req.file.path),
      file_type: req.file.mimetype,
    };
  }

  const updatedCheckup = await prisma.checkup.update({
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

  // If a document was uploaded, update the CheckupDocument
  if (documentData) {
    await prisma.checkupDocument.create({
      data: {
        checkup_id: updatedCheckup.checkup_id,
        file_name: documentData.file_name,
        file_path: documentData.file_path,
        file_type: documentData.file_type,
      },
    });
  }

  res.redirect(`/checkups`);
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