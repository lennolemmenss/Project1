// src/controllers/checkupController.js

// In-memory data store for checkups (to simulate a DB for now)
let checkups = [];

exports.createCheckup = (req, res) => {
  const { patient_id, doctor_id, checkup_type_id, checkup_date, notes, status } = req.body;
  const newCheckup = {
    checkup_id: checkups.length + 1,
    patient_id,
    doctor_id,
    checkup_type_id,
    checkup_date,
    notes,
    status
  };
  checkups.push(newCheckup);
  res.status(201).json(newCheckup);
};

exports.getAllCheckups = (req, res) => {
  res.status(200).json(checkups);
};

exports.getCheckupById = (req, res) => {
  const checkup = checkups.find(c => c.checkup_id === parseInt(req.params.id));
  if (!checkup) {
    return res.status(404).json({ message: "Checkup not found" });
  }
  res.status(200).json(checkup);
};

exports.updateCheckup = (req, res) => {
  const { patient_id, doctor_id, checkup_type_id, checkup_date, notes, status } = req.body;
  let checkup = checkups.find(c => c.checkup_id === parseInt(req.params.id));
  if (!checkup) {
    return res.status(404).json({ message: "Checkup not found" });
  }
  checkup = { ...checkup, patient_id, doctor_id, checkup_type_id, checkup_date, notes, status };
  res.status(200).json(checkup);
};

exports.deleteCheckup = (req, res) => {
  const index = checkups.findIndex(c => c.checkup_id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Checkup not found" });
  }
  checkups.splice(index, 1);
  res.status(200).json({ message: "Checkup deleted successfully" });
};
