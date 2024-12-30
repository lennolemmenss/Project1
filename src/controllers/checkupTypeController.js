// src/controllers/checkupTypeController.js

// Mock data storage for CheckupTypes
let checkupTypes = [];

exports.createCheckupType = (req, res) => {
  const { type_name, description } = req.body;
  const newCheckupType = {
    checkup_type_id: checkupTypes.length + 1,
    type_name,
    description
  };
  checkupTypes.push(newCheckupType);
  res.status(201).json(newCheckupType);
};

exports.getAllCheckupTypes = (req, res) => {
  res.status(200).json(checkupTypes);
};

exports.getCheckupTypeById = (req, res) => {
  const checkupType = checkupTypes.find(ct => ct.checkup_type_id === parseInt(req.params.id));
  if (!checkupType) {
    return res.status(404).json({ message: "CheckupType not found" });
  }
  res.status(200).json(checkupType);
};

exports.updateCheckupType = (req, res) => {
  const { type_name, description } = req.body;
  let checkupType = checkupTypes.find(ct => ct.checkup_type_id === parseInt(req.params.id));
  if (!checkupType) {
    return res.status(404).json({ message: "CheckupType not found" });
  }
  checkupType = { ...checkupType, type_name, description };
  res.status(200).json(checkupType);
};

exports.deleteCheckupType = (req, res) => {
  const index = checkupTypes.findIndex(ct => ct.checkup_type_id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "CheckupType not found" });
  }
  checkupTypes.splice(index, 1);
  res.status(200).json({ message: "CheckupType deleted successfully" });
};
