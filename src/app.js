// imports
const express = require('express');
const cors = require('cors');
const patientRoutes = require('./routes/patientRoutes');
const checkupRoutes = require('./routes/checkupRoutes');
const checkupTypeRoutes = require('./routes/checkupTypeRoutes'); 
const checkupDocumentRoutes = require('./routes/checkupDocumentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const prescriptionMedicationRoutes = require('./routes/prescriptionMedicationRoutes');


const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/checkups', checkupRoutes);
app.use('/api/checkup-types', checkupTypeRoutes);
app.use('/api/checkup-documents', checkupDocumentRoutes);
app.use('/api/doctors', doctorRoutes)
app.use('/api/medicalRecords', medicalRecordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/prescription-medications', prescriptionMedicationRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});