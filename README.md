# Doctor Management System

This is a Node.js application for managing doctors, patients, medical records, checkups, and prescriptions using Prisma and PostgreSQL.

## Project Overview

Design and implement a software solution that incorporates a relational data model which captures the scenario of a medical system responsible for managing patients, their medical records, checkups, and prescriptions. The system should enable doctors to add and edit patients, manage patient’s checkups and medications, and handle additional medical files for specific checkups. Medical records must show the patient’s disease history. Moreover, the solution should provide a way to export patient data to CSV format.

## Communication Between Application and Database

The application uses Prisma as an ORM (Object-Relational Mapping) tool to communicate with the PostgreSQL database. Prisma provides a type-safe query builder and migrations system to manage the database schema and data.

1. **Database Schema**: The database schema is defined in the `prisma/schema.prisma` file. This file contains the definitions of the tables and their relationships.

2. **Migrations**: Prisma migrations are used to apply changes to the database schema. The migrations are stored in the `prisma/migrations` folder and can be applied using the `npx prisma migrate dev` command.

3. **Prisma Client**: The Prisma client is generated using the `npx prisma generate` command. This client provides a type-safe API to interact with the database. The generated client is used in the repository classes to perform CRUD operations.

4. **Seeding Data**: The database can be seeded with initial data using the `prisma/seed.js` script. This script inserts sample data into the database for testing purposes.

5. **Exporting Data**: The application provides functionality to export patient data to CSV format. This is achieved using the `csv-writer` library, which converts the data retrieved from the database into CSV format.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL

## Setup

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Add your PostgreSQL connection string to the `.env` file:

   Open the `.env` file in the root of the project and add the following content if it does not already exist:
    
   ```properties
   # Paste here postgresql url 
   DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>"
   ```

   Replace `<username>`, `<password>`, `<host>`, `<port>`, and `<database>` with your PostgreSQL credentials.

4. Run Prisma migrations to set up the database schema:

   ```sh
   npx prisma migrate dev --name init
   ```

5. Generate Prisma client:

   ```sh
   npx prisma generate
   ```

6. Seed the database (optional):

   ```sh
   node prisma/seed.js
   ```

7. Start the application:

   ```sh
   npm start
   ```

   The application will be running on `http://localhost:3000`.

## Usage

- Navigate to `http://localhost:3000` to access the application.
- Use the provided routes to manage patients, doctors, medical records, checkups, and prescriptions.

## Project Structure

- `src/routes/` - Contains route handlers for different entities.
- `src/views/` - Contains EJS templates for rendering HTML pages.
- `src/uploads/` - Contains uploaded files such as documents and images.
- `prisma/` - Contains Prisma schema, migration files, and the seeding script.
- `src/app.js` - The main application file.

## License

This project is licensed under the MIT License.
