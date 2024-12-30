// src/routes/checkupDocumentRoutes.js

const express = require('express');
const router = express.Router();
const checkupDocumentController = require('../controllers/checkupDocumentController');

router.post('/', checkupDocumentController.createCheckupDocument);
router.get('/', checkupDocumentController.getAllCheckupDocuments);
router.get('/:id', checkupDocumentController.getCheckupDocumentById);
router.put('/:id', checkupDocumentController.updateCheckupDocument);
router.delete('/:id', checkupDocumentController.deleteCheckupDocument);

module.exports = router;
