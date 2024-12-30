const express = require('express');
const cors = require('cors');
const patientRoutes = require('./routes/patientRoutes');
const checkupRoutes = require('./routes/checkupRoutes');
const checkupTypeRoutes = require('./routes/checkupTypeRoutes'); // Import CheckupType routes
const checkupDocumentRoutes = require('./routes/checkupDocumentRoutes'); // Import CheckupDocument routes

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/checkups', checkupRoutes);
app.use('/api/checkup-types', checkupTypeRoutes); // Add CheckupType routes
app.use('/api/checkup-documents', checkupDocumentRoutes); // Add CheckupDocument routes

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
