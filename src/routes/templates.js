const express = require('express');
const router = express.Router();

// Dashboard
router.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

// Patients
router.get('/patients', (req, res) => {
  res.render('patient');
});

// Checkups
router.get('/checkups', (req, res) => {
  res.render('checkups');
});

// Export Data
router.get('/export', (req, res) => {
  res.render('export');
});

// Login
router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;

