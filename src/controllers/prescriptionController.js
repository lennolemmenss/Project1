const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPrescription = async (req, res) => {
  const { patient_id, doctor_id, prescribed_date, valid_until, notes } = req.body;
  try {
    const newPrescription = await prisma.prescription.create({
      data: {
        patient_id,
        doctor_id,
        prescribed_date,
        valid_until,
        notes
      },
    });
    res.status(201).json(newPrescription);
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ error: 'Error creating prescription' });
  }
};

exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prisma.prescription.findMany();
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Error fetching prescriptions' });
  }
};

exports.getPrescriptionById = async (req, res) => {
  const { id } = req.params;
  try {
    const prescription = await prisma.prescription.findUnique({
      where: { prescription_id: Number(id) },
    });
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.status(200).json(prescription);
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({ error: 'Error fetching prescription' });
  }
};

exports.updatePrescription = async (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, prescribed_date, valid_until, notes } = req.body;
  try {
    const updatedPrescription = await prisma.prescription.update({
      where: { prescription_id: Number(id) },
      data: {
        patient_id,
        doctor_id,
        prescribed_date,
        valid_until,
        notes,
      },
    });
    res.status(200).json(updatedPrescription);
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ error: 'Error updating prescription' });
  }
};

exports.deletePrescription = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.prescription.delete({
      where: { prescription_id: Number(id) },
    });
    res.status(200).json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({ error: 'Error deleting prescription' });
  }
};
