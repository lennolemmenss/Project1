const { PrismaClient } = require('@prisma/client'); // Import Prisma Client
const prisma = new PrismaClient(); // Initialize Prisma Client

async function main() {
  try {

    
    // Query all patients
    const allPatients = await prisma.patient.findMany();
    console.log('All Patients:', allPatients);

    // Query all doctors
    const allDoctors = await prisma.doctor.findMany();
    console.log('All Doctors:', allDoctors);

  } catch (error) {
    console.error('Error during Prisma operations:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client
  }
}

main(); // Run the main function
