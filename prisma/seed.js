const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed Doctors
  const doctors = [
    { first_name: 'John', last_name: 'Doe', specialization: 'Cardiology', contact_number: '123-456-7890', email: 'johndoe@hospital.com' },
    { first_name: 'Jane', last_name: 'Smith', specialization: 'Pediatrics', contact_number: '987-654-3210', email: 'janesmith@hospital.com' },
    { first_name: 'Sarah', last_name: 'Miller', specialization: 'Neurology', contact_number: '234-567-8901', email: 'sarah.miller@hospital.com' },
    { first_name: 'David', last_name: 'Lee', specialization: 'Orthopedics', contact_number: '345-678-9012', email: 'david.lee@hospital.com' },
    { first_name: 'Emily', last_name: 'Davis', specialization: 'Dermatology', contact_number: '456-789-0123', email: 'emily.davis@hospital.com' },
    { first_name: 'Michael', last_name: 'Brown', specialization: 'Gastroenterology', contact_number: '567-890-1234', email: 'michael.brown@hospital.com' },
    { first_name: 'Jessica', last_name: 'Wilson', specialization: 'Endocrinology', contact_number: '678-901-2345', email: 'jessica.wilson@hospital.com' },
    { first_name: 'Daniel', last_name: 'Moore', specialization: 'Ophthalmology', contact_number: '789-012-3456', email: 'daniel.moore@hospital.com' },
    { first_name: 'Laura', last_name: 'Taylor', specialization: 'Gynecology', contact_number: '890-123-4567', email: 'laura.taylor@hospital.com' },
    { first_name: 'Thomas', last_name: 'Anderson', specialization: 'Rheumatology', contact_number: '901-234-5678', email: 'thomas.anderson@hospital.com' }
  ];

  for (let doctor of doctors) {
    await prisma.doctor.create({ data: doctor });
  }

  // Seed Patients with condition_status
  const patients = [
    { first_name: 'Alice', last_name: 'Johnson', date_of_birth: new Date('1985-06-15'), contact_number: '555-123-4567', email: 'alice.johnson@example.com', address: '123 Elm Street', condition_status: 'active' },
    { first_name: 'Bob', last_name: 'Williams', date_of_birth: new Date('1990-02-20'), contact_number: '555-987-6543', email: 'bob.williams@example.com', address: '456 Oak Avenue', condition_status: 'resolved' },
    { first_name: 'Charlie', last_name: 'Brown', date_of_birth: new Date('1995-03-25'), contact_number: '555-567-8901', email: 'charlie.brown@example.com', address: '789 Pine Street', condition_status: 'under treatment' },
    { first_name: 'Dana', last_name: 'White', date_of_birth: new Date('1980-07-10'), contact_number: '555-876-5432', email: 'dana.white@example.com', address: '101 Maple Avenue', condition_status: 'resolved' },
    { first_name: 'Eva', last_name: 'Green', date_of_birth: new Date('1993-01-15'), contact_number: '555-432-1098', email: 'eva.green@example.com', address: '202 Birch Road', condition_status: 'active' },
    { first_name: 'Frank', last_name: 'Adams', date_of_birth: new Date('1987-09-30'), contact_number: '555-234-5678', email: 'frank.adams@example.com', address: '303 Cedar Lane', condition_status: 'under treatment' },
    { first_name: 'Grace', last_name: 'Clark', date_of_birth: new Date('2000-12-05'), contact_number: '555-345-6789', email: 'grace.clark@example.com', address: '404 Elm Road', condition_status: 'resolved' },
    { first_name: 'Henry', last_name: 'Martinez', date_of_birth: new Date('1982-04-18'), contact_number: '555-654-3210', email: 'henry.martinez@example.com', address: '505 Oak Street', condition_status: 'active' },
    { first_name: 'Ivy', last_name: 'Taylor', date_of_birth: new Date('1998-06-22'), contact_number: '555-765-4321', email: 'ivy.taylor@example.com', address: '606 Pine Road', condition_status: 'under treatment' },
    { first_name: 'Jack', last_name: 'Harris', date_of_birth: new Date('1989-11-14'), contact_number: '555-876-5432', email: 'jack.harris@example.com', address: '707 Birch Lane', condition_status: 'resolved' }
  ];

  for (let patient of patients) {
    await prisma.patient.create({ data: patient });
  }

  // Seed Checkup Types
  const checkupTypes = [
    { type_name: 'GP', description: 'General Physical Exam' },
    { type_name: 'BLOOD', description: 'Blood Test' },
    { type_name: 'X-RAY', description: 'X-Ray Scan' },
    { type_name: 'CT', description: 'CT Scan' },
    { type_name: 'MR', description: 'MRI Scan' },
    { type_name: 'ULTRA', description: 'Ultrasound' },
    { type_name: 'ECG', description: 'Electrocardiogram' },
    { type_name: 'ECHO', description: 'Echocardiogram' },
    { type_name: 'EYE', description: 'Eye Examination' },
    { type_name: 'DERM', description: 'Dermatological Examination' },
    { type_name: 'DENTA', description: 'Dental Checkup' },
    { type_name: 'MAMMO', description: 'Mammogram' },
    { type_name: 'NEURO', description: 'Neurological Examination' },
  ];

  for (let checkupType of checkupTypes) {
    await prisma.checkupType.create({ data: checkupType });
  }

  // Seed Checkups
  const checkups = [
    { patient_id: 1, doctor_id: 1, checkup_type_id: 1, checkup_date: new Date('2023-12-01'), notes: 'Patient is healthy.', status: 'Completed' },
    { patient_id: 2, doctor_id: 2, checkup_type_id: 2, checkup_date: new Date('2023-12-05'), notes: 'Blood pressure is slightly high.', status: 'Follow-up required' },
    { patient_id: 3, doctor_id: 3, checkup_type_id: 3, checkup_date: new Date('2023-12-10'), notes: 'No major issues detected.', status: 'Completed' },
    { patient_id: 4, doctor_id: 4, checkup_type_id: 4, checkup_date: new Date('2023-12-12'), notes: 'Minor neurological issues, follow-up needed.', status: 'Follow-up required' },
    { patient_id: 5, doctor_id: 5, checkup_type_id: 5, checkup_date: new Date('2023-12-15'), notes: 'No bone or joint issues.', status: 'Completed' },
    { patient_id: 6, doctor_id: 6, checkup_type_id: 6, checkup_date: new Date('2023-12-20'), notes: 'Minor digestive issues, further tests needed.', status: 'Follow-up required' },
    { patient_id: 7, doctor_id: 7, checkup_type_id: 7, checkup_date: new Date('2023-12-22'), notes: 'Routine pediatric checkup.', status: 'Completed' },
    { patient_id: 8, doctor_id: 8, checkup_type_id: 8, checkup_date: new Date('2023-12-25'), notes: 'Endocrinological concerns addressed.', status: 'Completed' },
    { patient_id: 9, doctor_id: 9, checkup_type_id: 9, checkup_date: new Date('2023-12-30'), notes: 'Eyes are healthy, no issues.', status: 'Completed' },
    { patient_id: 10, doctor_id: 10, checkup_type_id: 10, checkup_date: new Date('2023-12-31'), notes: 'Routine checkup, all is well.', status: 'Completed' }
  ];

  for (let checkup of checkups) {
    await prisma.checkup.create({ data: checkup });
  }

  // Seed Medications
  const medications = [
    { name: 'Aspirin', description: 'Used to reduce pain and fever', manufacturer: 'PharmaCorp' },
    { name: 'Metformin', description: 'Used to treat type 2 diabetes', manufacturer: 'HealthMeds' },
    { name: 'Ibuprofen', description: 'Pain reliever and anti-inflammatory', manufacturer: 'MedCo' },
    { name: 'Insulin', description: 'Used to treat diabetes', manufacturer: 'Diabeta' },
    { name: 'Paracetamol', description: 'Pain and fever reducer', manufacturer: 'MediCare' },
    { name: 'Amoxicillin', description: 'Antibiotic for infections', manufacturer: 'MediLabs' },
    { name: 'Lisinopril', description: 'Used to treat high blood pressure', manufacturer: 'BioPharma' },
    { name: 'Omeprazole', description: 'Used to treat acid reflux', manufacturer: 'PharmaPlus' },
    { name: 'Simvastatin', description: 'Lowers cholesterol levels', manufacturer: 'CardioMed' },
    { name: 'Losartan', description: 'Used to treat high blood pressure', manufacturer: 'HealthPro' }
  ];

  for (let medication of medications) {
    await prisma.medication.create({ data: medication });
  }

  // Seed Medical Records
  const medicalRecords = [
    { patient_id: 1, disease_name: 'Hypertension', diagnosis_date: new Date('2023-01-15'), notes: 'Mild hypertension, prescribed medication', status: 'Under Control' },
    { patient_id: 2, disease_name: 'Type 2 Diabetes', diagnosis_date: new Date('2023-02-20'), notes: 'Regular monitoring required', status: 'Active' },
    { patient_id: 3, disease_name: 'Asthma', diagnosis_date: new Date('2023-03-10'), notes: 'Seasonal triggers identified', status: 'Managed' },
    { patient_id: 4, disease_name: 'Arthritis', diagnosis_date: new Date('2023-04-05'), notes: 'Early stages, physiotherapy recommended', status: 'Active' },
    { patient_id: 5, disease_name: 'Migraine', diagnosis_date: new Date('2023-05-12'), notes: 'Trigger factors documented', status: 'Under Treatment' },
    { patient_id: 6, disease_name: 'GERD', diagnosis_date: new Date('2023-06-18'), notes: 'Dietary changes recommended', status: 'Active' },
    { patient_id: 7, disease_name: 'Allergic Rhinitis', diagnosis_date: new Date('2023-07-22'), notes: 'Seasonal allergies', status: 'Managed' },
    { patient_id: 8, disease_name: 'Hypothyroidism', diagnosis_date: new Date('2023-08-30'), notes: 'Regular medication started', status: 'Under Control' },
    { patient_id: 9, disease_name: 'Anxiety Disorder', diagnosis_date: new Date('2023-09-14'), notes: 'Therapy and medication prescribed', status: 'Active' },
    { patient_id: 10, disease_name: 'Eczema', diagnosis_date: new Date('2023-10-25'), notes: 'Topical treatment prescribed', status: 'Under Treatment' }
  ];

  for (let record of medicalRecords) {
    await prisma.medicalRecord.create({ data: record });
  }

  // Seed Checkup Documents
  const checkupDocuments = [
    { checkup_id: 1, file_name: 'default_document.jpg', file_path: '/uploads/default_document1.jpg', file_type: 'IMAGE' },
    { checkup_id: 2, file_name: 'default_document.jpg', file_path: '/uploads/default_document2.jpg', file_type: 'IMAGE' },
    { checkup_id: 3, file_name: 'default_document.jpg', file_path: '/uploads/default_document3.jpg', file_type: 'IMAGE' },
    { checkup_id: 4, file_name: 'default_document.jpg', file_path: '/uploads/default_document4.jpg', file_type: 'IMAGE' },
    { checkup_id: 5, file_name: 'default_document.jpg', file_path: '/uploads/default_document5.jpg', file_type: 'IMAGE' },
    { checkup_id: 6, file_name: 'default_document.jpg', file_path: '/uploads/default_document6.jpg', file_type: 'IMAGE' },
    { checkup_id: 7, file_name: 'default_document.jpg', file_path: '/uploads/default_document7.jpg', file_type: 'IMAGE' },
    { checkup_id: 8, file_name: 'default_document.jpg', file_path: '/uploads/default_document8.jpg', file_type: 'IMAGE' },
    { checkup_id: 9, file_name: 'default_document.jpg', file_path: '/uploads/default_document9.jpg', file_type: 'IMAGE' },
    { checkup_id: 10 ,file_name: 'default_document.jpg', file_path: '/uploads/default_document10.jpg', file_type: 'IMAGE' },
  ];
  
  for (let document of checkupDocuments) {
    await prisma.checkupDocument.create({ data: document });
  }

  // Seed Prescriptions
  const prescriptions = [
    { patient_id: 1, doctor_id: 1, prescribed_date: new Date('2023-12-01'), valid_until: new Date('2024-03-01'), notes: 'Take with meals' },
    { patient_id: 2, doctor_id: 2, prescribed_date: new Date('2023-12-05'), valid_until: new Date('2024-03-05'), notes: 'Monitor blood sugar levels' },
    { patient_id: 3, doctor_id: 3, prescribed_date: new Date('2023-12-10'), valid_until: new Date('2024-03-10'), notes: 'Use as needed' },
    { patient_id: 4, doctor_id: 4, prescribed_date: new Date('2023-12-12'), valid_until: new Date('2024-03-12'), notes: 'Take before bedtime' },
    { patient_id: 5, doctor_id: 5, prescribed_date: new Date('2023-12-15'), valid_until: new Date('2024-03-15'), notes: 'Avoid alcohol' }
  ];

  for (let prescription of prescriptions) {
    const createdPrescription = await prisma.prescription.create({ data: prescription });

    // Create PrescriptionMedications for each prescription
    const prescriptionMedications = [
      { prescription_id: createdPrescription.prescription_id, medication_id: 1, quantity: 30, dosage: '100mg', frequency: 'Once daily', instructions: 'Take with water' },
      { prescription_id: createdPrescription.prescription_id, medication_id: 2, quantity: 60, dosage: '500mg', frequency: 'Twice daily', instructions: 'Take after meals' }
    ];

    for (let prescMed of prescriptionMedications) {
      await prisma.prescriptionMedication.create({ data: prescMed });
    }
  }

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
