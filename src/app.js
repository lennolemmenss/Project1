const express = require('express');
const path = require('path');
const cors = require('cors');
const methodOverride = require('method-override');
const templateRoutes = require('./routes/templates');
const patientRoutes = require('./routes/patientRoutes');

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
app.use('/patients', patientRoutes);  // All patient routes will be prefixed with /patients
app.use('/', templateRoutes);         // Other template routes

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});