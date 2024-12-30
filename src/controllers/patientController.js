const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patients' });
  }
};

// Get a patient by ID
exports.getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await prisma.patient.findUnique({
      where: { patient_id: Number(id) },
    });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patient' });
  }
};

// Create a new patient
exports.createPatient = async (req, res) => {
  const { first_name, last_name, date_of_birth, contact_number, email, address } = req.body;
  try {
    const newPatient = await prisma.patient.create({
      data: {
        first_name,
        last_name,
        date_of_birth: new Date(date_of_birth),
        contact_number,
        email,
        address,
      },
    });
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: 'Error creating patient' });
  }
};

// Update a patient's information
exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, date_of_birth, contact_number, email, address } = req.body;
  try {
    const updatedPatient = await prisma.patient.update({
      where: { patient_id: Number(id) },
      data: {
        first_name,
        last_name,
        date_of_birth: new Date(date_of_birth),
        contact_number,
        email,
        address,
      },
    });
    if (!updatedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: 'Error updating patient' });
  }
};

// Delete a patient
exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPatient = await prisma.patient.delete({
      where: { patient_id: Number(id) },
    });
    if (!deletedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting patient' });
  }
};
