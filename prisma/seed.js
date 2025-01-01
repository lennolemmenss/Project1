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
    { type_name: 'General Checkup', description: 'Routine health examination' },
    { type_name: 'Cardiology Checkup', description: 'Heart-related health examination' },
    { type_name: 'Dermatology Checkup', description: 'Skin health and issues checkup' },
    { type_name: 'Neurology Checkup', description: 'Examination related to brain and nervous system' },
    { type_name: 'Orthopedic Checkup', description: 'Examination of bones, joints, and muscles' },
    { type_name: 'Gastroenterology Checkup', description: 'Examination of the digestive system' },
    { type_name: 'Pediatric Checkup', description: 'Routine checkup for children' },
    { type_name: 'Endocrinology Checkup', description: 'Examination of hormones and metabolism' },
    { type_name: 'Ophthalmology Checkup', description: 'Eye examination and care' },
    { type_name: 'Gynecology Checkup', description: 'Women’s reproductive health checkup' }
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
