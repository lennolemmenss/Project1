const express = require('express');
const path = require('path');
const cors = require('cors');
const methodOverride = require('method-override');
const templateRoutes = require('./routes/templates');
const patientRoutes = require('./routes/patientRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const medicationRoutes = require('./routes/medicationRoutes'); // Adjust path as necessary
const dashboardRoutes = require('./routes/dashboardRoutes');
const checkupRoutes = require('./routes/checkupRoutes');
const checkupDocumentRoutes = require('./routes/checkupDocumentRoutes');


const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));

// Mount routes
app.use('/patients', patientRoutes);
app.use('/medication', medicationRoutes);
app.use('/checkups', checkupRoutes);
app.use('/checkups', checkupDocumentRoutes);

app.use('/', dashboardRoutes);
app.use('/' ,medicalRecordRoutes);
app.use('/', prescriptionRoutes)
app.use('/', templateRoutes);   

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});