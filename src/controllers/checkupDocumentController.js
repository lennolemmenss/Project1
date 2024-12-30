// src/controllers/checkupDocumentController.js

// Mock data storage for CheckupDocuments
let checkupDocuments = [];

exports.createCheckupDocument = (req, res) => {
  const { checkup_id, file_name, file_path, file_type } = req.body;
  const newCheckupDocument = {
    document_id: checkupDocuments.length + 1,
    checkup_id,
    file_name,
    file_path,
    file_type,
    upload_date: new Date().toISOString()
  };
  checkupDocuments.push(newCheckupDocument);
  res.status(201).json(newCheckupDocument);
};

exports.getAllCheckupDocuments = (req, res) => {
  res.status(200).json(checkupDocuments);
};

exports.getCheckupDocumentById = (req, res) => {
  const checkupDocument = checkupDocuments.find(cd => cd.document_id === parseInt(req.params.id));
  if (!checkupDocument) {
    return res.status(404).json({ message: "CheckupDocument not found" });
  }
  res.status(200).json(checkupDocument);
};

exports.updateCheckupDocument = (req, res) => {
  const { checkup_id, file_name, file_path, file_type } = req.body;
  let checkupDocument = checkupDocuments.find(cd => cd.document_id === parseInt(req.params.id));
  if (!checkupDocument) {
    return res.status(404).json({ message: "CheckupDocument not found" });
  }
  checkupDocument = { ...checkupDocument, checkup_id, file_name, file_path, file_type };
  res.status(200).json(checkupDocument);
};

exports.deleteCheckupDocument = (req, res) => {
  const index = checkupDocuments.findIndex(cd => cd.document_id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "CheckupDocument not found" });
  }
  checkupDocuments.splice(index, 1);
  res.status(200).json({ message: "CheckupDocument deleted successfully" });
};
