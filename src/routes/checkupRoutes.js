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

/// POST create or update a checkup, including multiple document uploads
router.post('/:id?', upload.array('documents', 10), async (req, res) => {
  const { id } = req.params;
  const { 
    patient_id, 
    doctor_id, 
    checkup_type_id, 
    checkup_date, 
    notes, 
    status,
    documents_to_delete // Array of document IDs to delete
  } = req.body;

  try {
    // Handle document deletions if specified
    if (documents_to_delete) {
      const deleteIds = Array.isArray(documents_to_delete) 
        ? documents_to_delete.map(Number) 
        : [Number(documents_to_delete)];

      await prisma.checkupDocument.deleteMany({
        where: {
          document_id: {
            in: deleteIds
          }
        }
      });
    }

    let checkupData = {
      patient_id: Number(patient_id),
      doctor_id: Number(doctor_id),
      checkup_type_id: Number(checkup_type_id),
      checkup_date: new Date(checkup_date),
      notes,
      status,
    };

    // Update or create the checkup
    let updatedCheckup;
    if (id) {
      updatedCheckup = await prisma.checkup.update({
        where: { checkup_id: Number(id) },
        data: checkupData,
      });
    } else {
      updatedCheckup = await prisma.checkup.create({
        data: checkupData,
      });
    }

    // Handle new document uploads
    if (req.files && req.files.length > 0) {
      const documentPromises = req.files.map(file => {
        return prisma.checkupDocument.create({
          data: {
            checkup_id: updatedCheckup.checkup_id,
            file_name: file.originalname,
            file_path: `/uploads/${file.filename}`,
            file_type: file.mimetype,
          },
        });
      });

      await Promise.all(documentPromises);
    }

    res.redirect(`/checkups/${updatedCheckup.checkup_id}/details`);
  } catch (error) {
    console.error('Error processing checkup:', error);
    res.status(500).send('Error processing checkup');
  }
});


// DELETE a specific document
router.delete('/documents/:documentId', async (req, res) => {
  const { documentId } = req.params;
  
  try {
    await prisma.checkupDocument.delete({
      where: { document_id: Number(documentId) },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ success: false, error: 'Error deleting document' });
  }
});

module.exports = router;
