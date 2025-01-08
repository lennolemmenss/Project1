const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Configure Multer for file uploads
const upload = multer({
  dest: 'uploads/', // Destination folder for uploaded files
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type.'));
    }
  },
});

// POST upload a new document for a specific checkup
router.post('/:checkup_id/documents', upload.single('file'), async (req, res) => {
  const { checkup_id } = req.params;
  const { file } = req;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // Save file information to the database
  await prisma.checkupDocument.create({
    data: {
      checkup_id: Number(checkup_id),
      file_name: file.originalname,
      file_path: `/uploads/${file.filename}`,
      file_type: file.mimetype,
    },
  });

  res.redirect(`/checkups/${checkup_id}`);
});

module.exports = router;
