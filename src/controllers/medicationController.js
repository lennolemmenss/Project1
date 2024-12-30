const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createMedication = async (req, res) => {
  const { name, description, manufacturer } = req.body;
  try {
    const newMedication = await prisma.medication.create({
      data: {
        name,
        description,
        manufacturer
      },
    });
    res.status(201).json(newMedication);
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(500).json({ error: 'Error creating medication' });
  }
};

exports.getAllMedications = async (req, res) => {
  try {
    const medications = await prisma.medication.findMany();
    res.status(200).json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'Error fetching medications' });
  }
};

exports.getMedicationById = async (req, res) => {
  const { id } = req.params;
  try {
    const medication = await prisma.medication.findUnique({
      where: { medication_id: Number(id) },
    });
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.status(200).json(medication);
  } catch (error) {
    console.error('Error fetching medication:', error);
    res.status(500).json({ error: 'Error fetching medication' });
  }
};

exports.updateMedication = async (req, res) => {
  const { id } = req.params;
  const { name, description, manufacturer } = req.body;
  try {
    const updatedMedication = await prisma.medication.update({
      where: { medication_id: Number(id) },
      data: {
        name,
        description,
        manufacturer
      },
    });
    res.status(200).json(updatedMedication);
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({ error: 'Error updating medication' });
  }
};

exports.deleteMedication = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.medication.delete({
      where: { medication_id: Number(id) },
    });
    res.status(200).json({ message: 'Medication deleted successfully' });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({ error: 'Error deleting medication' });
  }
};
