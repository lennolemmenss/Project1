const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Show all medications
router.get('/', async (req, res) => {
  try {
    const medications = await prisma.medication.findMany(); // Fetch medications from the database
    res.render('medication', { medications }); // Pass medications to the EJS template
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Show the form to create a new medication
router.get('/new', (req, res) => {
  res.render('create-edit-medication', { medication: null });
});

// Show the form to edit an existing medication
router.get('/:id/edit', async (req, res) => {
  try {
    const medicationId = parseInt(req.params.id);
    if (isNaN(medicationId)) {
      return res.status(400).send('Invalid medication ID');
    }

    const medication = await prisma.medication.findUnique({
      where: { medication_id: medicationId },
    });

    if (!medication) {
      return res.status(404).send('Medication not found');
    }

    res.render('create-edit-medication', { medication });
  } catch (error) {
    console.error('Error fetching medication for editing:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Create new medication
router.post('/', async (req, res) => {
  try {
    const { name, description, manufacturer } = req.body;

    await prisma.medication.create({
      data: {
        name,
        description,
        manufacturer,
      },
    });

    res.redirect('/medication'); // Redirect to the medications list
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(500).send('Something went wrong');
  }
});

// Update medication
router.put('/:id', async (req, res) => {
  try {
    const medicationId = parseInt(req.params.id);
    if (isNaN(medicationId)) {
      return res.status(400).send('Invalid medication ID');
    }

    const { name, description, manufacturer } = req.body;

    await prisma.medication.update({
      where: { medication_id: medicationId },
      data: {
        name,
        description,
        manufacturer,
      },
    });

    res.redirect('/medication'); // Redirect to the medications list
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).send('Something went wrong');
  }
});

// Delete medication
router.delete('/:id', async (req, res) => {
  try {
    const medicationId = parseInt(req.params.id);
    if (isNaN(medicationId)) {
      return res.status(400).send('Invalid medication ID');
    }

    await prisma.medication.delete({
      where: { medication_id: medicationId },
    });

    res.redirect('/medication'); // Redirect to the medications list
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).send('Error deleting medication');
  }
});

module.exports = router;
