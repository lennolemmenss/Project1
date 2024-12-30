const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createCheckupDocument = async (req, res) => {
  const { checkup_id, file_name, file_path, file_type } = req.body;
  try {
    const newCheckupDocument = await prisma.checkupDocument.create({
      data: {
        checkup_id,
        file_name,
        file_path,
        file_type,
      },
    });
    res.status(201).json(newCheckupDocument);
  } catch (error) {
    res.status(500).json({ error: 'Error creating CheckupDocument' });
  }
};

exports.getAllCheckupDocuments = async (req, res) => {
  try {
    const checkupDocuments = await prisma.checkupDocument.findMany();
    res.status(200).json(checkupDocuments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching CheckupDocuments' });
  }
};

exports.getCheckupDocumentById = async (req, res) => {
  const { id } = req.params;
  try {
    const checkupDocument = await prisma.checkupDocument.findUnique({
      where: { document_id: Number(id) },
    });
    if (!checkupDocument) {
      return res.status(404).json({ message: 'CheckupDocument not found' });
    }
    res.status(200).json(checkupDocument);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching CheckupDocument' });
  }
};

exports.updateCheckupDocument = async (req, res) => {
  const { id } = req.params;
  const { checkup_id, file_name, file_path, file_type } = req.body;
  try {
    const updatedCheckupDocument = await prisma.checkupDocument.update({
      where: { document_id: Number(id) },
      data: {
        checkup_id,
        file_name,
        file_path,
        file_type,
      },
    });
    res.status(200).json(updatedCheckupDocument);
  } catch (error) {
    res.status(500).json({ error: 'Error updating CheckupDocument' });
  }
};

exports.deleteCheckupDocument = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.checkupDocument.delete({
      where: { document_id: Number(id) },
    });
    res.status(200).json({ message: 'CheckupDocument deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting CheckupDocument' });
  }
};
