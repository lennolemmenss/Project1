# Doctor Management System

This is a Node.js application for managing doctors, patients, medical records, checkups, and prescriptions using Prisma and PostgreSQL.

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

- `routes/` - Contains route handlers for different entities.
- `repositories/` - Contains repository classes for data access.
- `views/` - Contains EJS templates for rendering HTML pages.
- `prisma/` - Contains Prisma schema and migration files.

## License

This project is licensed under the MIT License.
