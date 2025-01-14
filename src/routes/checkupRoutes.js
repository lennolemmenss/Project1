const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadsPath = path.join(__dirname, '..', 'uploads');
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    // Add timestamp to prevent filename collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Add file type validation if needed
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
      orderBy: {
        checkup_date: 'desc'
      }
    });

    res.render('checkups', { checkups });
  } catch (error) {
    console.error('Error fetching checkups:', error);
    res.status(500).render('error', { 
      message: 'Error fetching checkups', 
      error 
    });
  }
});

// GET checkup details
router.get('/:id/details', async (req, res) => {
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

    if (!checkup) {
      return res.status(404).render('error', { 
        message: 'Checkup not found' 
      });
    }

    const checkupDocuments = await prisma.checkupDocument.findMany({
      where: { checkup_id: Number(id) },
      orderBy: {
        upload_date: 'desc'
      }
    });

    res.render('checkupdetails', { checkup, checkupDocuments });
  } catch (error) {
    console.error('Error fetching checkup details:', error);
    res.status(500).render('error', { 
      message: 'Error fetching checkup details', 
      error 
    });
  }
});

// GET form to create a new checkup
router.get('/new', async (req, res) => {
  try {
    const [patients, doctors, checkupTypes] = await Promise.all([
      prisma.patient.findMany({
        orderBy: { last_name: 'asc' }
      }),
      prisma.doctor.findMany({
        orderBy: { last_name: 'asc' }
      }),
      prisma.checkupType.findMany({
        orderBy: { type_name: 'asc' }
      })
    ]);

    res.render('create-edit-checkups', {
      checkup: null,
      patients,
      doctors,
      checkupTypes,
      checkupDocuments: [],
    });
  } catch (error) {
    console.error('Error loading new checkup form:', error);
    res.status(500).render('error', { 
      message: 'Error loading form for new checkup', 
      error 
    });
  }
});

// GET form to edit an existing checkup
router.get('/:id/edit', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [checkup, patients, doctors, checkupTypes, checkupDocuments] = await Promise.all([
      prisma.checkup.findUnique({
        where: { checkup_id: Number(id) },
        include: {
          patient: true,
          doctor: true,
          checkupType: true,
        },
      }),
      prisma.patient.findMany({
        orderBy: { last_name: 'asc' }
      }),
      prisma.doctor.findMany({
        orderBy: { last_name: 'asc' }
      }),
      prisma.checkupType.findMany({
        orderBy: { type_name: 'asc' }
      }),
      prisma.checkupDocument.findMany({
        where: { checkup_id: Number(id) },
        orderBy: { upload_date: 'desc' }
      })
    ]);

    if (!checkup) {
      return res.status(404).render('error', { 
        message: 'Checkup not found' 
      });
    }

    res.render('create-edit-checkups', {
      checkup,
      patients,
      doctors,
      checkupTypes,
      checkupDocuments,
    });
  } catch (error) {
    console.error('Error loading edit checkup form:', error);
    res.status(500).render('error', { 
      message: 'Error loading edit form', 
      error 
    });
  }
});

// POST create or update a checkup
router.post('/:id?', upload.array('documents', 10), async (req, res) => {
  const { id } = req.params;
  const { 
    patient_id, 
    doctor_id, 
    checkup_type_id, 
    checkup_date, 
    notes, 
    status,
    documents_to_delete 
  } = req.body;

  try {
    // Handle document deletions if specified
    if (documents_to_delete) {
      const deleteIds = Array.isArray(documents_to_delete) 
        ? documents_to_delete.map(Number) 
        : [Number(documents_to_delete)];

      for (const docId of deleteIds) {
        const document = await prisma.checkupDocument.findUnique({
          where: { document_id: docId }
        });

        if (document) {
          try {
            const filePath = path.join(__dirname, '..', 'uploads', path.basename(document.file_path));
            await fs.unlink(filePath);
          } catch (fileError) {
            console.error('Error deleting file:', fileError);
          }
        }
      }

      await prisma.checkupDocument.deleteMany({
        where: {
          document_id: {
            in: deleteIds
          }
        }
      });
    }

    // Prepare checkup data
    const checkupData = {
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
    res.status(500).render('error', { 
      message: 'Error processing checkup', 
      error 
    });
  }
});

// POST delete document
router.post('/documents/:documentId/delete', async (req, res) => {
  const { documentId } = req.params;
  
  try {
    const document = await prisma.checkupDocument.findUnique({
      where: { document_id: Number(documentId) },
    });

    if (!document) {
      return res.status(404).json({ 
        success: false, 
        error: 'Document not found' 
      });
    }

    // Delete physical file
    try {
      const filePath = path.join(__dirname, '..', 'uploads', path.basename(document.file_path));
      await fs.unlink(filePath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Only return error if file exists but couldn't be deleted
      if (fileError.code !== 'ENOENT') {
        return res.status(500).json({ 
          success: false, 
          error: 'Error deleting physical file' 
        });
      }
    }

    // Delete database record
    await prisma.checkupDocument.delete({
      where: { document_id: Number(documentId) },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ 
      success: false, 
      error: `Error deleting document: ${error.message}` 
    });
  }
});

// DELETE checkup
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Get all associated documents
    const documents = await prisma.checkupDocument.findMany({
      where: { checkup_id: Number(id) }
    });

    // Delete physical files
    for (const document of documents) {
      try {
        const filePath = path.join(__dirname, '..', 'uploads', path.basename(document.file_path));
        await fs.unlink(filePath);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
      }
    }

    // Delete all associated documents and the checkup in a transaction
    await prisma.$transaction([
      prisma.checkupDocument.deleteMany({
        where: { checkup_id: Number(id) }
      }),
      prisma.checkup.delete({
        where: { checkup_id: Number(id) },
      })
    ]);

    res.redirect('/checkups');
  } catch (error) {
    console.error('Error deleting checkup:', error);
    res.status(500).render('error', { 
      message: 'Error deleting checkup', 
      error 
    });
  }
});

module.exports = router;



