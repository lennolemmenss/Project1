-- CreateTable
CREATE TABLE "Patient" (
    "patient_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "contact_number" TEXT,
    "email" TEXT,
    "address" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "doctor_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "contact_number" TEXT,
    "email" TEXT,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("doctor_id")
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "record_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "disease_name" TEXT NOT NULL,
    "diagnosis_date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" TEXT,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("record_id")
);

-- CreateTable
CREATE TABLE "Checkup" (
    "checkup_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "checkup_type_id" INTEGER NOT NULL,
    "checkup_date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" TEXT,

    CONSTRAINT "Checkup_pkey" PRIMARY KEY ("checkup_id")
);

-- CreateTable
CREATE TABLE "CheckupType" (
    "checkup_type_id" SERIAL NOT NULL,
    "type_name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CheckupType_pkey" PRIMARY KEY ("checkup_type_id")
);

-- CreateTable
CREATE TABLE "CheckupDocument" (
    "document_id" SERIAL NOT NULL,
    "checkup_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "upload_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckupDocument_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "prescription_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "prescribed_date" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("prescription_id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "medication_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "manufacturer" TEXT,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("medication_id")
);

-- CreateTable
CREATE TABLE "PrescriptionMedication" (
    "prescription_id" INTEGER NOT NULL,
    "medication_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "instructions" TEXT,

    CONSTRAINT "PrescriptionMedication_pkey" PRIMARY KEY ("prescription_id","medication_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "Doctor"("email");

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkup" ADD CONSTRAINT "Checkup_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkup" ADD CONSTRAINT "Checkup_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("doctor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkup" ADD CONSTRAINT "Checkup_checkup_type_id_fkey" FOREIGN KEY ("checkup_type_id") REFERENCES "CheckupType"("checkup_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckupDocument" ADD CONSTRAINT "CheckupDocument_checkup_id_fkey" FOREIGN KEY ("checkup_id") REFERENCES "Checkup"("checkup_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("doctor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionMedication" ADD CONSTRAINT "PrescriptionMedication_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "Prescription"("prescription_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionMedication" ADD CONSTRAINT "PrescriptionMedication_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "Medication"("medication_id") ON DELETE RESTRICT ON UPDATE CASCADE;
