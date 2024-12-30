const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createCheckupType = async (req, res) => {
  const { type_name, description } = req.body;
  try {
    const newCheckupType = await prisma.checkupType.create({
      data: {
        type_name,
        description,
      },
    });
    res.status(201).json(newCheckupType);
  } catch (error) {
    res.status(500).json({ error: 'Error creating CheckupType' });
  }
};

exports.getAllCheckupTypes = async (req, res) => {
  try {
    const checkupTypes = await prisma.checkupType.findMany();
    res.status(200).json(checkupTypes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching CheckupTypes' });
  }
};

exports.getCheckupTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const checkupType = await prisma.checkupType.findUnique({
      where: { checkup_type_id: Number(id) },
    });
    if (!checkupType) {
      return res.status(404).json({ message: 'CheckupType not found' });
    }
    res.status(200).json(checkupType);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching CheckupType' });
  }
};

exports.updateCheckupType = async (req, res) => {
  const { id } = req.params;
  const { type_name, description } = req.body;
  try {
    const updatedCheckupType = await prisma.checkupType.update({
      where: { checkup_type_id: Number(id) },
      data: {
        type_name,
        description,
      },
    });
    res.status(200).json(updatedCheckupType);
  } catch (error) {
    res.status(500).json({ error: 'Error updating CheckupType' });
  }
};

exports.deleteCheckupType = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.checkupType.delete({
      where: { checkup_type_id: Number(id) },
    });
    res.status(200).json({ message: 'CheckupType deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting CheckupType' });
  }
};
