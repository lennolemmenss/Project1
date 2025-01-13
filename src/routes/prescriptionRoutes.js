// prescriptionRoutes.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Display form to create a new prescription
router.get('/patients/:patientId/prescriptions/new', async (req, res) => {
  const { patientId } = req.params;

  try {
    const patient = await prisma.patient.findUnique({
      where: { patient_id: parseInt(patientId) },
    });

    if (!patient) {
      return res.status(404).send('Patient not found');
    }

    // Fetch all medications and doctors
    const medications = await prisma.medication.findMany();
    const doctors = await prisma.doctor.findMany();

    res.render('create-edit-prescription', {
      action: 'create',
      patient,
      prescription: null,
      medications,
      doctors, // Add doctors to the template
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create a new prescription along with its medications
router.post('/patients/:patientId/prescriptions', async (req, res) => {
  const { patientId } = req.params;
  const { doctor_id, prescribed_date, valid_until, notes } = req.body;

  // Restructure the medications data
  const medications = [];
  const medicationRegex = /^medications\[(\d+)\]\[([^\]]+)\]$/;
  
  Object.keys(req.body).forEach(key => {
    const match = key.match(medicationRegex);
    if (match) {
      const [_, index, field] = match;
      if (!medications[index]) {
        medications[index] = {};
      }
      medications[index][field] = req.body[key];
    }
  });

  console.log("Restructured medications:", medications);

  try {
    // Use a transaction to ensure both prescription and medications are created
    const result = await prisma.$transaction(async (prisma) => {
      // Create the prescription first
      const prescription = await prisma.prescription.create({
        data: {
          patient_id: parseInt(patientId),
          doctor_id: parseInt(doctor_id),
          prescribed_date: new Date(prescribed_date),
          valid_until: new Date(valid_until),
          notes,
        },
      });

      // If medications were provided, create the prescription medications
      if (medications.length > 0) {
        // Process each medication
        const prescriptionMedications = await Promise.all(
          medications.map(async (med) => {
            console.log("Processing medication:", med);
            // Find or create the medication
            let medication = await prisma.medication.findFirst({
              where: { name: med.medication_name }
            });

            if (!medication) {
              medication = await prisma.medication.create({
                data: {
                  name: med.medication_name,
                  description: '', // Add default description if needed
                }
              });
            }

            // Create the prescription medication relation
            return prisma.prescriptionMedication.create({
              data: {
                prescription_id: prescription.prescription_id,
                medication_id: medication.medication_id,
                quantity: parseInt(med.quantity),
                dosage: med.dosage,
                frequency: med.frequency,
                instructions: med.instructions || null,
              },
            });
          })
        );
      }

      return prescription;
    });

    res.redirect(`/patients/${patientId}`);
  } catch (err) {
    console.error("Error creating prescription:", err);
    res.status(500).send('Server error');
  }
});

// Update an existing prescription along with its medications
router.put('/prescriptions/:prescriptionId', async (req, res) => {
  const { prescriptionId } = req.params;
  const { doctor_id, prescribed_date, valid_until, notes } = req.body;

  // Use the same medications parsing logic as in create route
  const medications = [];
  const medicationRegex = /^medications\[(\d+)\]\[([^\]]+)\]$/;
  
  Object.keys(req.body).forEach(key => {
    const match = key.match(medicationRegex);
    if (match) {
      const [_, index, field] = match;
      if (!medications[index]) {
        medications[index] = {};
      }
      medications[index][field] = req.body[key];
    }
  });

  console.log("Restructured medications for update:", medications);

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Update the prescription
      const prescription = await prisma.prescription.update({
        where: { prescription_id: parseInt(prescriptionId) },
        data: {
          doctor_id: parseInt(doctor_id),
          prescribed_date: new Date(prescribed_date),
          valid_until: new Date(valid_until),
          notes,
        },
      });

      // Delete existing prescription medications
      await prisma.prescriptionMedication.deleteMany({
        where: { prescription_id: parseInt(prescriptionId) },
      });

      // If medications were provided, create the prescription medications
      if (medications.length > 0) {
        // Process each medication using the same logic as create route
        const prescriptionMedications = await Promise.all(
          medications.map(async (med) => {
            console.log("Processing medication:", med);
            // Find or create the medication
            let medication = await prisma.medication.findFirst({
              where: { name: med.medication_name }
            });

            if (!medication) {
              medication = await prisma.medication.create({
                data: {
                  name: med.medication_name,
                  description: '', // Add default description if needed
                }
              });
            }

            // Create the prescription medication relation
            return prisma.prescriptionMedication.create({
              data: {
                prescription_id: prescription.prescription_id,
                medication_id: medication.medication_id,
                quantity: parseInt(med.quantity),
                dosage: med.dosage,
                frequency: med.frequency,
                instructions: med.instructions || null,
              },
            });
          })
        );
      }

      return prescription;
    });

    res.redirect(`/patients/${result.patient_id}`);
  } catch (err) {
    console.error("Error updating prescription:", err);
    res.status(500).send('Server error');
  }
});

// Get prescription for editing
router.get('/prescriptions/:prescriptionId/edit', async (req, res) => {
  const { prescriptionId } = req.params;

  try {
    const prescription = await prisma.prescription.findUnique({
      where: { prescription_id: parseInt(prescriptionId) },
      include: {
        patient: true,
        prescriptionMedications: {
          include: {
            medication: true
          }
        }
      }
    });

    if (!prescription) {
      return res.status(404).send('Prescription not found');
    }

    // Fetch all medications and doctors
    const medications = await prisma.medication.findMany();
    const doctors = await prisma.doctor.findMany();

    res.render('create-edit-prescription', {
      prescription,
      patient: prescription.patient,
      medications,
      doctors, // Add doctors to the template
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete a prescription and its associated medications
router.delete('/prescriptions/:prescriptionId', async (req, res) => {
  const { prescriptionId } = req.params;

  try {
    const prescription = await prisma.prescription.findUnique({
      where: { prescription_id: parseInt(prescriptionId) },
      select: { patient_id: true }
    });

    if (!prescription) {
      return res.status(404).send('Prescription not found');
    }

    await prisma.$transaction(async (prisma) => {
      // Delete associated prescription medications first
      await prisma.prescriptionMedication.deleteMany({
        where: { prescription_id: parseInt(prescriptionId) }
      });

      // Then delete the prescription
      await prisma.prescription.delete({
        where: { prescription_id: parseInt(prescriptionId) }
      });
    });

    res.redirect(`/patients/${prescription.patient_id}`);
  } catch (err) {
    console.error('Error deleting prescription:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;