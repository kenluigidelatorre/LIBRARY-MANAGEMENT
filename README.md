# College Management System — Library Management Module

The Library Management Module is a subsystem of the College Management System (CMS). It manages library resources and borrowing-related records and provides API endpoints for integration with other CMS modules.

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

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- OpenAPI 3.0.3
- Swagger UI
- Figma

## Project Structure

```text
LIBRARY-MANAGEMENT/
├── client/
├── docs/
├── server/
│   ├── database/
│   │   └── library_schema.sql
│   ├── src/
│   │   ├── config/
│   │   ├── data/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.js
│   ├── .env.example
│   ├── openapi.yaml
│   ├── package.json
│   └── README.md
└── README.md
```

## Getting Started

### Requirements

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/kenluigidelatorre/LIBRARY-MANAGEMENT.git
cd LIBRARY-MANAGEMENT
```

### 2. Set Up the Database

Create a PostgreSQL database named `library_management`, then execute the SQL schema in:

`server/database/library_schema.sql`

### 3. Configure the Server

Open the server directory:

```bash
cd server
```

Copy `.env.example` to `.env` and update the database credentials for your local PostgreSQL installation.

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Server

Development mode:

```bash
npm run dev
```

Normal mode:

```bash
npm start
```

## API Documentation

When the server is running, open:

- API root: http://localhost:5000/
- Swagger UI: http://localhost:5000/docs
- Health check: http://localhost:5000/api/v1/health

The API base path used by the Express server is `/api/v1`.

## Documentation

- API specification: `server/openapi.yaml`
- Database schema: `server/database/library_schema.sql`
- Backend setup instructions: `server/README.md`

## Security

- Do not commit `.env` files containing actual credentials.
- Keep database passwords and other secrets private.
- Use `.env.example` to document the required environment variables.

## Project Status

Refer to the actual implementation and test results before marking endpoints or external integrations as completed. The presence of an endpoint in the OpenAPI specification does not necessarily mean that it has been fully implemented or tested.