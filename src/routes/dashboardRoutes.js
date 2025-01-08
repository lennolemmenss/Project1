const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Dashboard route
router.get('/dashboard', async (req, res) => {
  try {
    // Fetch total count of prescriptions
    const totalPrescriptions = await prisma.prescription.count();

    // Fetch count of valid prescriptions (non-expired)
    const validPrescriptions = await prisma.prescription.count({
      where: {
        valid_until: {
          gte: new Date(),
        },
      },
    });

    // Pass the data to the EJS view
    res.render('dashboard', {
      totalPrescriptions,
      validPrescriptions,
    });
  } catch (error) {
    console.error('Error fetching prescription counts:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
