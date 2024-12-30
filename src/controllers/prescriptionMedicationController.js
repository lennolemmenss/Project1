const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPrescriptionMedication = async (req, res) => {
  const { prescription_id, medication_id, quantity, dosage, frequency, instructions } = req.body;
  try {
    const newPrescriptionMedication = await prisma.prescriptionMedication.create({
      data: {
        prescription_id,
        medication_id,
        quantity,
        dosage,
        frequency,
        instructions
      },
    });
    res.status(201).json(newPrescriptionMedication);
  } catch (error) {
    console.error('Error creating PrescriptionMedication:', error);
    res.status(500).json({ error: 'Error creating PrescriptionMedication' });
  }
};

exports.getAllPrescriptionMedications = async (req, res) => {
  try {
    const prescriptionMedications = await prisma.prescriptionMedication.findMany();
    res.status(200).json(prescriptionMedications);
  } catch (error) {
    console.error('Error fetching PrescriptionMedications:', error);
    res.status(500).json({ error: 'Error fetching PrescriptionMedications' });
  }
};

exports.getPrescriptionMedicationById = async (req, res) => {
  const { prescription_id, medication_id } = req.params;
  try {
    const prescriptionMedication = await prisma.prescriptionMedication.findUnique({
      where: {
        prescription_id_medication_id: {
          prescription_id: Number(prescription_id),
          medication_id: Number(medication_id),
        },
      },
    });
    if (!prescriptionMedication) {
      return res.status(404).json({ message: 'PrescriptionMedication not found' });
    }
    res.status(200).json(prescriptionMedication);
  } catch (error) {
    console.error('Error fetching PrescriptionMedication:', error);
    res.status(500).json({ error: 'Error fetching PrescriptionMedication' });
  }
};

exports.updatePrescriptionMedication = async (req, res) => {
  const { prescription_id, medication_id } = req.params;
  const { quantity, dosage, frequency, instructions } = req.body;
  try {
    const updatedPrescriptionMedication = await prisma.prescriptionMedication.update({
      where: {
        prescription_id_medication_id: {
          prescription_id: Number(prescription_id),
          medication_id: Number(medication_id),
        },
      },
      data: {
        quantity,
        dosage,
        frequency,
        instructions
      },
    });
    res.status(200).json(updatedPrescriptionMedication);
  } catch (error) {
    console.error('Error updating PrescriptionMedication:', error);
    res.status(500).json({ error: 'Error updating PrescriptionMedication' });
  }
};

exports.deletePrescriptionMedication = async (req, res) => {
  const { prescription_id, medication_id } = req.params;
  try {
    await prisma.prescriptionMedication.delete({
      where: {
        prescription_id_medication_id: {
          prescription_id: Number(prescription_id),
          medication_id: Number(medication_id),
        },
      },
    });
    res.status(200).json({ message: 'PrescriptionMedication deleted successfully' });
  } catch (error) {
    console.error('Error deleting PrescriptionMedication:', error);
    res.status(500).json({ error: 'Error deleting PrescriptionMedication' });
  }
};
