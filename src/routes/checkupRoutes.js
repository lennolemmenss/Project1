const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      const uploadsPath = path.join(__dirname, '..', 'uploads');
      cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

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
  try {
    const patients = await prisma.patient.findMany();
    const doctors = await prisma.doctor.findMany();
    const checkupTypes = await prisma.checkupType.findMany();

    // Pass `checkupDocuments` as an empty array for new checkup
    res.render('create-edit-checkups', {
      checkup: null,
      patients,
      doctors,
      checkupTypes,
      checkupDocuments: [], // Ensure checkupDocuments is defined
    });
  } catch (error) {
    console.error('Error fetching data for new checkup:', error);
    res.status(500).send('Error loading form for new checkup');
  }
});

// GET form to edit an existing checkup
router.get('/:id/edit', async (req, res) => {
  const { id } = req.params;
  
  try {
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

    // Fetch associated documents for the checkup
    const checkupDocuments = await prisma.checkupDocument.findMany({
      where: { checkup_id: Number(id) },
    });

    // Render the edit form, passing the checkup and its documents
    res.render('create-edit-checkups', {
      checkup,
      patients,
      doctors,
      checkupTypes,
      checkupDocuments, // Pass documents to the template
    });
  } catch (error) {
    console.error('Error fetching checkup or documents:', error);
    res.status(500).send('Error fetching checkup for editing');
  }
});

/// POST create or update a checkup, including document upload
router.post('/:id?', upload.single('document'), async (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, checkup_type_id, checkup_date, notes, status } = req.body;
  let documentData = null;

  if (req.file) {
    documentData = {
      file_name: req.file.originalname,
      file_path: `/uploads/${req.file.filename}`, // Correct path for client access
      file_type: req.file.mimetype,
    };
  }

  let updatedCheckup;
  if (id) {
    // Update the checkup details
    updatedCheckup = await prisma.checkup.update({
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

    // If a new document is uploaded, replace the old one
    if (documentData) {
      // Delete the existing document associated with the checkup
      await prisma.checkupDocument.deleteMany({
        where: { checkup_id: Number(id) },
      });

      // Save the new document
      await prisma.checkupDocument.create({
        data: {
          checkup_id: Number(id),
          file_name: documentData.file_name,
          file_path: documentData.file_path,
          file_type: documentData.file_type,
        },
      });
    }
  } else {
    // Create a new checkup
    updatedCheckup = await prisma.checkup.create({
      data: {
        patient_id: Number(patient_id),
        doctor_id: Number(doctor_id),
        checkup_type_id: Number(checkup_type_id),
        checkup_date: new Date(checkup_date),
        notes,
        status,
      },
    });

    // Save the new document if uploaded
    if (documentData) {
      await prisma.checkupDocument.create({
          data: {
              checkup_id: updatedCheckup.checkup_id,
              file_name: documentData.file_name,
              file_path: `/uploads/${req.file.filename}`, // Make sure this matches your static route
              file_type: documentData.file_type,
          },
      });
    }
  }

  res.redirect(`/checkups`);
});

// DELETE an existing checkup
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await prisma.checkupDocument.deleteMany({
    where: { checkup_id: Number(id) }
  });

  await prisma.checkup.delete({
    where: { checkup_id: Number(id) },
  });
  res.redirect('/checkups');
});

module.exports = router;
