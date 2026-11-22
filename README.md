# College Management System — Library Management Module

The Library Management Module is a subsystem of the College Management System (CMS). It provides REST API endpoints for managing books, library students, faculty, loans, reservations, fines, finance payments, and Registrar-related data.

## Team Members

- **Ashly Jana Quising** — Frontend
- **Ken Luigi Dela Torre** — Backend
- **Luieme Etcobanes** — Documentation

## Project Links

- **GitHub Repository:** https://github.com/kenluigidelatorre/LIBRARY-MANAGEMENT.git
- **Figma Prototype:** https://www.figma.com/design/WZ9KzDGJjEfuc3BAhKxhdZ/Project-SIA

## Features

- **Books:** Manage book records.
- **Library Students:** Retrieve student records maintained by the Library module.
- **Library Faculty:** Retrieve faculty records maintained by the Library module.
- **Registrar Integration:** Provide endpoints for retrieving student information for verification.
- **Loans:** Manage book borrowing records.
- **Reservations:** Manage book reservations.
- **Fines:** Record and manage library fines.
- **Finance Payments:** Provide endpoints for fine-payment records.

## Technology Stack

- **Runtime:** Node.js
- **Backend framework:** Express.js
- **Database:** PostgreSQL
- **Database driver:** `pg`
- **API specification:** OpenAPI
- **API documentation:** Swagger UI

## Project Structure

```text
LIBRARY-MANAGEMENT/
|-- client/
|-- server/
|   |-- database/
|   |   `-- library_schema.sql
|   |-- src/
|   |   |-- config/
|   |   |-- data/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- index.js
|   |-- .env.example
|   |-- openapi.yaml
|   |-- package.json
|   `-- README.md
|-- docs/
|-- postman/
`-- README.md
```

## Prerequisites

Install the following before running the backend:

- [Node.js](https://nodejs.org/) and npm
- [PostgreSQL](https://www.postgresql.org/)
- Git, if you need to clone the repository

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kenluigidelatorre/LIBRARY-MANAGEMENT.git
cd LIBRARY-MANAGEMENT
```

If you already have the repository, open a terminal in its root directory instead.

### 2. Create the PostgreSQL database

Start PostgreSQL, then create a database named `library_management`.

For example, using `psql`:

```sql
CREATE DATABASE library_management;
```

If the database already exists, do not create it again.

### 3. Initialize the database schema

From the repository root, run:

```bash
psql -U postgres -d library_management -f server/database/library_schema.sql
```

Replace `postgres` with your PostgreSQL username if necessary.

**Warning:** The schema contains `DROP TABLE IF EXISTS ... CASCADE` statements. Running it again can delete existing tables and related data. Use it only when initializing a new database or when you intentionally want to reset the schema.

### 4. Configure environment variables

From the repository root, copy the example environment file using PowerShell:

```powershell
Copy-Item server/.env.example server/.env
```

Open `server/.env` and update the values for your local PostgreSQL setup:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=library_management
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

Replace `your_postgres_password` with your own PostgreSQL password. Make sure the database name, username, password, host, and port match your PostgreSQL installation.

Do not commit your `.env` file or share real credentials.

### 5. Install backend dependencies

From the repository root, run:

```bash
cd server
npm install
```

### 6. Start the backend

For normal use:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

The development command uses `nodemon`, which is included in the server's development dependencies.

The server checks its PostgreSQL connection before listening for requests. Ensure PostgreSQL is running and your `.env` settings are correct.

## Verify the API

Once the server starts successfully, open these URLs in your browser:

| Resource | URL | Purpose |
|---|---|---|
| API root | http://localhost:5000/ | Confirms the API responds |
| Health endpoint | http://localhost:5000/api/v1/health | Returns the API health status |
| Swagger UI | http://localhost:5000/docs | Interactive API documentation |

Successful database connectivity is also required during server startup.

## API Route Overview

The backend registers these route groups:

| Resource | Base endpoint |
|---|---|
| Books | `/api/v1/books` |
| Library students | `/api/v1/library/students` |
| Library faculty | `/api/v1/library/faculty` |
| Registrar | `/api/v1/registrar` |
| Loans | `/api/v1/loans` |
| Reservations | `/api/v1/reservations` |
| Fines | `/api/v1/fines` |
| Finance payments | `/api/v1/finance/payments` |

For available HTTP methods, request parameters, and response formats, consult the Swagger UI or `server/openapi.yaml`.

## Documentation

Additional project documentation is maintained in the `docs/` directory. It includes architecture, data model, design system, agreements, and architecture decisions.

Other useful files include:

- API specification: `server/openapi.yaml`
- Database schema: `server/database/library_schema.sql`
- Backend setup instructions: `server/README.md`

## Security and Notes

- Do not commit local `.env` files or credentials.
- Keep database passwords and other secrets private.
- Use `.env.example` to document required environment variables.
- The SQL schema initializes tables; it does not create the database itself.
- The client directory is included in the repository, but follow its own README and verified setup instructions before attempting to run the frontend.
- Refer to the actual implementation and test results before marking endpoints or external integrations as completed. An endpoint listed in the OpenAPI specification is not necessarily fully implemented or tested.
