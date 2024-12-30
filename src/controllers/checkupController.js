const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new checkup
exports.createCheckup = async (req, res) => {
  const { patient_id, doctor_id, checkup_type_id, checkup_date, notes, status } = req.body;

  try {
    const newCheckup = await prisma.checkup.create({
      data: {
        patient_id,
        doctor_id,
        checkup_type_id,
        checkup_date: new Date(checkup_date), // Ensure the date is parsed correctly
        notes,
        status,
      },
    });
    res.status(201).json(newCheckup);
  } catch (error) {
    console.error('Error creating checkup:', error);
    res.status(500).json({ error: 'Error creating checkup' });
  }
};

// Get all checkups
exports.getAllCheckups = async (req, res) => {
  try {
    const checkups = await prisma.checkup.findMany();
    res.status(200).json(checkups);
  } catch (error) {
    console.error('Error fetching checkups:', error);
    res.status(500).json({ error: 'Error fetching checkups' });
  }
};

// Get a checkup by ID
exports.getCheckupById = async (req, res) => {
  const { id } = req.params;

  try {
    const checkup = await prisma.checkup.findUnique({
      where: { checkup_id: Number(id) },
    });
    if (!checkup) {
      return res.status(404).json({ message: 'Checkup not found' });
    }
    res.status(200).json(checkup);
  } catch (error) {
    console.error('Error fetching checkup by ID:', error);
    res.status(500).json({ error: 'Error fetching checkup by ID' });
  }
};

// Update a checkup
exports.updateCheckup = async (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, checkup_type_id, checkup_date, notes, status } = req.body;

  try {
    const updatedCheckup = await prisma.checkup.update({
      where: { checkup_id: Number(id) },
      data: {
        patient_id,
        doctor_id,
        checkup_type_id,
        checkup_date: new Date(checkup_date),
        notes,
        status,
      },
    });
    res.status(200).json(updatedCheckup);
  } catch (error) {
    console.error('Error updating checkup:', error);
    res.status(500).json({ error: 'Error updating checkup' });
  }
};

// Delete a checkup
exports.deleteCheckup = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCheckup = await prisma.checkup.delete({
      where: { checkup_id: Number(id) },
    });
    res.status(200).json({ message: 'Checkup deleted successfully' });
  } catch (error) {
    console.error('Error deleting checkup:', error);
    res.status(500).json({ error: 'Error deleting checkup' });
  }
};
