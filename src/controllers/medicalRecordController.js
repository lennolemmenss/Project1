const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createMedicalRecord = async (req, res) => {
  const { patient_id, disease_name, diagnosis_date, notes, status } = req.body;
  try {
    const newMedicalRecord = await prisma.medicalRecord.create({
      data: {
        patient_id,
        disease_name,
        diagnosis_date,
        notes,
        status
      },
    });
    res.status(201).json(newMedicalRecord);
  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({ error: 'Error creating medical record' });
  }
};

exports.getAllMedicalRecords = async (req, res) => {
  try {
    const medicalRecords = await prisma.medicalRecord.findMany();
    res.status(200).json(medicalRecords);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ error: 'Error fetching medical records' });
  }
};

exports.getMedicalRecordById = async (req, res) => {
  const { id } = req.params;
  try {
    const medicalRecord = await prisma.medicalRecord.findUnique({
      where: { record_id: Number(id) },
    });
    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.status(200).json(medicalRecord);
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({ error: 'Error fetching medical record' });
  }
};

exports.updateMedicalRecord = async (req, res) => {
  const { id } = req.params;
  const { disease_name, diagnosis_date, notes, status } = req.body;
  try {
    const updatedMedicalRecord = await prisma.medicalRecord.update({
      where: { record_id: Number(id) },
      data: {
        disease_name,
        diagnosis_date,
        notes,
        status,
      },
    });
    res.status(200).json(updatedMedicalRecord);
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({ error: 'Error updating medical record' });
  }
};

exports.deleteMedicalRecord = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.medicalRecord.delete({
      where: { record_id: Number(id) },
    });
    res.status(200).json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({ error: 'Error deleting medical record' });
  }
};
