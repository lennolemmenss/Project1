const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createDoctor = async (req, res) => {
  const { first_name, last_name, specialization, contact_number, email } = req.body;

  try {
    const newDoctor = await prisma.doctor.create({
      data: {
        first_name,
        last_name,
        specialization,
        contact_number,
        email,
      },
    });
    res.status(201).json(newDoctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Error creating doctor' });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany();
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Error fetching doctors' });
  }
};

exports.getDoctorById = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { doctor_id: Number(id) },
    });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ error: 'Error fetching doctor' });
  }
};

exports.updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, specialization, contact_number, email } = req.body;

  try {
    const updatedDoctor = await prisma.doctor.update({
      where: { doctor_id: Number(id) },
      data: {
        first_name,
        last_name,
        specialization,
        contact_number,
        email,
      },
    });
    res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: 'Error updating doctor' });
  }
};

exports.deleteDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.doctor.delete({
      where: { doctor_id: Number(id) },
    });
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ error: 'Error deleting doctor' });
  }
};
