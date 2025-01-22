const express = require('express');
const path = require('path');
const cors = require('cors');
const methodOverride = require('method-override');
const fs = require('fs');

// Route imports
const templateRoutes = require('./routes/templates');
const patientRoutes = require('./routes/patientRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const checkupRoutes = require('./routes/checkupRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();
const port = 3000;

// Create uploads directory if it doesn't exist
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

const exportsPath = path.join(__dirname, 'exports');
if (!fs.existsSync(exportsPath)) {
    fs.mkdirSync(exportsPath, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files setup
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(uploadsPath));

// Mount routes
app.use('/patients', patientRoutes);
app.use('/medication', medicationRoutes);
app.use('/checkups', checkupRoutes);
app.use('/export', exportRoutes);
app.use('/', medicalRecordRoutes);
app.use('/', prescriptionRoutes);
app.use('/', templateRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});