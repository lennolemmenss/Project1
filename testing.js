const axios = require('axios');

// URL of your local server (replace if different)
const apiUrl = 'http://localhost:3000/api';

// Utility function for sending POST requests
const postData = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    console.log(`Created: ${url} -`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error creating data at ${url}:`, error.response?.data || error.message);
    throw error;
  }
};

// Utility function for sending GET requests
const getData = async (url) => {
  try {
    const response = await axios.get(url);
    console.log(`Fetched data from ${url}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.response?.data || error.message);
    throw error;
  }
};

// Utility function for sending DELETE requests
const deleteData = async (url) => {
  try {
    const response = await axios.delete(url);
    console.log(`Deleted: ${url} -`, response.data);
  } catch (error) {
    console.error(`Error deleting data at ${url}:`, error.response?.data || error.message);
  }
};

// 1. Create Patient
const createPatient = async () => {
  const patient = await postData(`${apiUrl}/patients`, {
    first_name: 'John',
    last_name: 'Doe',
    date_of_birth: '1990-01-01T00:00:00.000Z',
    contact_number: '1234567890',
    email: 'johndoe@example.com',
    address: '123 Main St',
  });
  return patient.patient_id;
};

// 2. Create Doctor
const createDoctor = async () => {
  const doctor = await postData(`${apiUrl}/doctors`, {
    first_name: 'Dr. Smith',
    last_name: 'Johnson',
    specialization: 'Cardiology',
    contact_number: '0987654321',
    email: 'drsmith@example.com',
  });
  return doctor.doctor_id;
};

// 3. Create CheckupType
const createCheckupType = async () => {
  const checkupType = await postData(`${apiUrl}/checkup-types`, {
    type_name: 'Routine Checkup',
    description: 'General health checkup',
  });
  return checkupType.checkup_type_id;
};

// 4. Create Checkup
const createCheckup = async (patientId, doctorId, checkupTypeId) => {
  const checkup = await postData(`${apiUrl}/checkups`, {
    patient_id: patientId,
    doctor_id: doctorId,
    checkup_type_id: checkupTypeId,
    checkup_date: '2024-12-30T10:00:00.000Z',
    notes: 'Regular checkup',
    status: 'Completed',
  });
  return checkup.checkup_id;
};

// 5. Create MedicalRecord
const createMedicalRecord = async (patientId) => {
  const medicalRecord = await postData(`${apiUrl}/medicalRecords`, {
    patient_id: patientId,
    disease_name: 'Hypertension',
    diagnosis_date: '2024-12-29T00:00:00.000Z',
    notes: 'Patient diagnosed with high blood pressure',
    status: 'Under treatment',
  });
  return medicalRecord.record_id;
};

// 6. Create Prescription
const createPrescription = async (patientId, doctorId) => {
  const prescription = await postData(`${apiUrl}/prescriptions`, {
    patient_id: patientId,
    doctor_id: doctorId,
    prescribed_date: '2024-12-30T00:00:00.000Z',
    valid_until: '2025-12-30T00:00:00.000Z',
    notes: 'Take one pill daily',
  });
  return prescription.prescription_id;
};

// 7. Create Medication
const createMedication = async () => {
  const medication = await postData(`${apiUrl}/medications`, {
    name: 'Atenolol',
    description: 'Used to treat high blood pressure',
    manufacturer: 'Pharma Corp',
  });
  return medication.medication_id;
};

// 8. Create PrescriptionMedication
const createPrescriptionMedication = async (prescriptionId, medicationId) => {
  const prescriptionMedication = await postData(`${apiUrl}/prescription-medications`, {
    prescription_id: prescriptionId,
    medication_id: medicationId,
    quantity: 30,
    dosage: '50mg',
    frequency: 'Once daily',
    instructions: 'Take with food',
  });
  return prescriptionMedication;
};

// 9. Read All Entities
const readEntities = async () => {
  await getData(`${apiUrl}/patients`);
  await getData(`${apiUrl}/doctors`);
  await getData(`${apiUrl}/checkup-types`);
  await getData(`${apiUrl}/checkups`);
  await getData(`${apiUrl}/medicalRecords`);
  await getData(`${apiUrl}/prescriptions`);
  await getData(`${apiUrl}/medications`);
  await getData(`${apiUrl}/prescription-medications`);
};

// 10. Update Data
const updateEntities = async (patientId, doctorId) => {
  await axios.put(`${apiUrl}/patients/${patientId}`, {
    first_name: 'John Updated',
    last_name: 'Doe Updated',
  });
  await axios.put(`${apiUrl}/doctors/${doctorId}`, {
    first_name: 'Dr. Smith Updated',
    last_name: 'Johnson Updated',
  });
};

// 11. Delete Data (In reverse order)
const deleteEntities = async () => {
  await deleteData(`${apiUrl}/prescription-medications`);
  await deleteData(`${apiUrl}/prescriptions`);
  await deleteData(`${apiUrl}/medications`);
  await deleteData(`${apiUrl}/medicalRecords`);
  await deleteData(`${apiUrl}/checkups`);
  await deleteData(`${apiUrl}/checkup-documents`);
  await deleteData(`${apiUrl}/checkup-types`);
  await deleteData(`${apiUrl}/doctors`);
  await deleteData(`${apiUrl}/patients`);
};

// Running the test
const runTests = async () => {
  try {
    console.log('Creating data...');
    const patientId = await createPatient();
    const doctorId = await createDoctor();
    const checkupTypeId = await createCheckupType();
    const checkupId = await createCheckup(patientId, doctorId, checkupTypeId);
    const medicalRecordId = await createMedicalRecord(patientId);
    const prescriptionId = await createPrescription(patientId, doctorId);
    const medicationId = await createMedication();
    await createPrescriptionMedication(prescriptionId, medicationId);

    console.log('Reading data...');
    await readEntities();

    console.log('Updating data...');
    await updateEntities(patientId, doctorId);

    console.log('Deleting data...');
    await deleteEntities();
  } catch (error) {
    console.error('Error in test execution:', error);
  }
};

runTests();
