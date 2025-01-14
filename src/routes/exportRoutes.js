const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/export', async (req, res) => {
  const { type } = req.query;

  try {
    let data = [];
    let headers = [];
    let filename = '';

    switch (type) {
      case 'patients':
        data = await prisma.patient.findMany();
        headers = [
          { id: 'patient_id', title: 'Patient ID' },
          { id: 'first_name', title: 'First Name' },
          { id: 'last_name', title: 'Last Name' },
          { id: 'date_of_birth', title: 'Date of Birth' },
          { id: 'contact_number', title: 'Contact Number' },
          { id: 'email', title: 'Email' },
          { id: 'address', title: 'Address' },
          { id: 'condition_status', title: 'Condition Status' },
        ];
        filename = 'patients.csv';
        break;

      case 'medicalRecords':
        const medicalRecords = await prisma.medicalRecord.findMany({
          include: { patient: true },
        });
        data = medicalRecords.map(record => ({
          record_id: record.record_id,
          patient_id: record.patient_id,
          patient_name: `${record.patient.first_name} ${record.patient.last_name}`,
          disease_name: record.disease_name,
          diagnosis_date: record.diagnosis_date,
          notes: record.notes,
          status: record.status,
        }));
        headers = [
          { id: 'record_id', title: 'Record ID' },
          { id: 'patient_id', title: 'Patient ID' },
          { id: 'patient_name', title: 'Patient Name' },
          { id: 'disease_name', title: 'Disease Name' },
          { id: 'diagnosis_date', title: 'Diagnosis Date' },
          { id: 'notes', title: 'Notes' },
          { id: 'status', title: 'Status' },
        ];
        filename = 'medical_records.csv';
        break;

      case 'prescriptions':
        const prescriptions = await prisma.prescription.findMany({
          include: { patient: true, doctor: true },
        });
        data = prescriptions.map(prescription => ({
          prescription_id: prescription.prescription_id,
          patient_id: prescription.patient_id,
          patient_name: `${prescription.patient.first_name} ${prescription.patient.last_name}`,
          doctor_id: prescription.doctor_id,
          doctor_name: `${prescription.doctor.first_name} ${prescription.doctor.last_name}`,
          prescribed_date: prescription.prescribed_date,
          valid_until: prescription.valid_until,
          notes: prescription.notes,
        }));
        headers = [
          { id: 'prescription_id', title: 'Prescription ID' },
          { id: 'patient_id', title: 'Patient ID' },
          { id: 'patient_name', title: 'Patient Name' },
          { id: 'doctor_id', title: 'Doctor ID' },
          { id: 'doctor_name', title: 'Doctor Name' },
          { id: 'prescribed_date', title: 'Prescribed Date' },
          { id: 'valid_until', title: 'Valid Until' },
          { id: 'notes', title: 'Notes' },
        ];
        filename = 'prescriptions.csv';
        break;

      case 'checkups':
        const checkups = await prisma.checkup.findMany({
          include: { patient: true, doctor: true },
        });
        data = checkups.map(checkup => ({
          checkup_id: checkup.checkup_id,
          patient_id: checkup.patient_id,
          patient_name: `${checkup.patient.first_name} ${checkup.patient.last_name}`,
          doctor_id: checkup.doctor_id,
          doctor_name: `${checkup.doctor.first_name} ${checkup.doctor.last_name}`,
          checkup_date: checkup.checkup_date,
          notes: checkup.notes,
          status: checkup.status,
        }));
        headers = [
          { id: 'checkup_id', title: 'Checkup ID' },
          { id: 'patient_id', title: 'Patient ID' },
          { id: 'patient_name', title: 'Patient Name' },
          { id: 'doctor_id', title: 'Doctor ID' },
          { id: 'doctor_name', title: 'Doctor Name' },
          { id: 'checkup_date', title: 'Checkup Date' },
          { id: 'notes', title: 'Notes' },
          { id: 'status', title: 'Status' },
        ];
        filename = 'checkups.csv';
        break;

      default:
        return res.status(400).send('Invalid export type');
    }

    // Write to CSV
    const filePath = path.join(__dirname, '..', 'exports', filename);
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: headers,
    });

    await csvWriter.writeRecords(data);

    // Send file for download
    res.download(filePath, filename, err => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error generating file');
      }

      // Delete file after sending
      fs.unlink(filePath, () => {});
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).send('Error exporting data');
  }
});

module.exports = router;
