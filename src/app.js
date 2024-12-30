// imports
const express = require('express');
const path = require('path');
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
const templateRoutes = require('./routes/templates');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// EJS template routes
app.use('/', templateRoutes); 



// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});