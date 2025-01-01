const express = require('express');
const path = require('path');
const cors = require('cors');
const templateRoutes = require('./routes/templates');
const patientRoutes = require('./routes/patientRoutes');  // Import the patient routes

const app = express();
const port = 3000;

const methodOverride = require('method-override');
app.use(methodOverride('_method')); // Use _method query parameter for overriding methods


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));

// EJS template routes
app.use('/', templateRoutes);
app.use('/', patientRoutes);  // Add this line to handle the patient routes



// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
