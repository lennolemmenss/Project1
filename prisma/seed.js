const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed Doctors
  const doctor1 = await prisma.doctor.create({
    data: {
      first_name: 'John',
      last_name: 'Doe',
      specialization: 'Cardiology',
      contact_number: '123-456-7890',
      email: 'johndoe@hospital.com',
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      first_name: 'Jane',
      last_name: 'Smith',
      specialization: 'Pediatrics',
      contact_number: '987-654-3210',
      email: 'janesmith@hospital.com',
    },
  });

  // Seed Patients
  const patient1 = await prisma.patient.create({
    data: {
      first_name: 'Alice',
      last_name: 'Johnson',
      date_of_birth: new Date('1985-06-15'),
      contact_number: '555-123-4567',
      email: 'alice.johnson@example.com',
      address: '123 Elm Street',
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      first_name: 'Bob',
      last_name: 'Williams',
      date_of_birth: new Date('1990-02-20'),
      contact_number: '555-987-6543',
      email: 'bob.williams@example.com',
      address: '456 Oak Avenue',
    },
  });

  // Seed Checkup Types
  const checkupType1 = await prisma.checkupType.create({
    data: {
      type_name: 'General Checkup',
      description: 'Routine health examination',
    },
  });

  const checkupType2 = await prisma.checkupType.create({
    data: {
      type_name: 'Cardiology Checkup',
      description: 'Heart-related health examination',
    },
  });

  // Seed Checkups
  const checkup1 = await prisma.checkup.create({
    data: {
      patient_id: patient1.patient_id,
      doctor_id: doctor1.doctor_id,
      checkup_type_id: checkupType1.checkup_type_id,
      checkup_date: new Date('2023-12-01'),
      notes: 'Patient is healthy.',
      status: 'Completed',
    },
  });

  const checkup2 = await prisma.checkup.create({
    data: {
      patient_id: patient2.patient_id,
      doctor_id: doctor2.doctor_id,
      checkup_type_id: checkupType2.checkup_type_id,
      checkup_date: new Date('2023-12-05'),
      notes: 'Blood pressure is slightly high.',
      status: 'Follow-up required',
    },
  });

  // Seed Checkup Documents
  await prisma.checkupDocument.create({
    data: {
      checkup_id: checkup1.checkup_id,
      file_name: 'report1.pdf',
      file_path: '/uploads/report1.pdf',
      file_type: 'PDF',
    },
  });

  await prisma.checkupDocument.create({
    data: {
      checkup_id: checkup2.checkup_id,
      file_name: 'report2.pdf',
      file_path: '/uploads/report2.pdf',
      file_type: 'PDF',
    },
  });

  // Seed Medical Records
  await prisma.medicalRecord.create({
    data: {
      patient_id: patient1.patient_id,
      disease_name: 'Hypertension',
      diagnosis_date: new Date('2021-11-15'),
      notes: 'Patient is on medication.',
      status: 'Ongoing',
    },
  });

  await prisma.medicalRecord.create({
    data: {
      patient_id: patient2.patient_id,
      disease_name: 'Diabetes',
      diagnosis_date: new Date('2022-05-20'),
      notes: 'Patient advised to control diet.',
      status: 'Under Control',
    },
  });

  // Seed Medications
  const medication1 = await prisma.medication.create({
    data: {
      name: 'Aspirin',
      description: 'Used to reduce pain and fever',
      manufacturer: 'PharmaCorp',
    },
  });

  const medication2 = await prisma.medication.create({
    data: {
      name: 'Metformin',
      description: 'Used to treat type 2 diabetes',
      manufacturer: 'HealthMeds',
    },
  });

  // Seed Prescriptions
  const prescription1 = await prisma.prescription.create({
    data: {
      patient_id: patient1.patient_id,
      doctor_id: doctor1.doctor_id,
      prescribed_date: new Date('2023-11-10'),
      valid_until: new Date('2024-11-10'),
      notes: 'Take medication with food.',
    },
  });

  const prescription2 = await prisma.prescription.create({
    data: {
      patient_id: patient2.patient_id,
      doctor_id: doctor2.doctor_id,
      prescribed_date: new Date('2023-10-01'),
      valid_until: new Date('2024-10-01'),
      notes: 'Avoid alcohol while taking this medication.',
    },
  });

  // Seed Prescription Medications
  await prisma.prescriptionMedication.create({
    data: {
      prescription_id: prescription1.prescription_id,
      medication_id: medication1.medication_id,
      quantity: 30,
      dosage: '75mg',
      frequency: 'Once a day',
      instructions: 'Take with water.',
    },
  });

  await prisma.prescriptionMedication.create({
    data: {
      prescription_id: prescription2.prescription_id,
      medication_id: medication2.medication_id,
      quantity: 60,
      dosage: '500mg',
      frequency: 'Twice a day',
      instructions: 'Take with meals.',
    },
  });

  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error seeding the database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
