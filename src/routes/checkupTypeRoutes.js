// src/routes/checkupTypeRoutes.js

const express = require('express');
const router = express.Router();
const checkupTypeController = require('../controllers/checkupTypeController');

router.post('/', checkupTypeController.createCheckupType);
router.get('/', checkupTypeController.getAllCheckupTypes);
router.get('/:id', checkupTypeController.getCheckupTypeById);
router.put('/:id', checkupTypeController.updateCheckupType);
router.delete('/:id', checkupTypeController.deleteCheckupType);

module.exports = router;
