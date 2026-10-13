# Library Management System API — Server

This directory contains the backend API for the College Management System's Library Management Module. The backend uses Node.js, Express.js, and PostgreSQL.

## Technology Stack

- Node.js
- Express.js
- PostgreSQL
- `pg`
- `dotenv`
- `cors`
- OpenAPI 3.0.3
- Swagger UI Express

## Requirements

- Node.js and npm
- PostgreSQL
- A PostgreSQL database configured for this project

## Installation

Install the backend dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file by copying `.env.example`.

**Windows Command Prompt**

```bat
copy .env.example .env
```

**PowerShell**

```powershell
Copy-Item .env.example .env
```

Edit `.env` with your local PostgreSQL settings:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=library_management
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

Replace `your_postgres_password` with your actual local database password. Never commit the real `.env` file to GitHub.

## Database Setup

The database schema is located at:

`database/library_schema.sql`

Create the database if necessary, then execute the schema against it.

Example using PostgreSQL command-line tools:

```bash
createdb -U postgres library_management
psql -U postgres -d library_management -f database/library_schema.sql
```

If the database already exists, skip the `createdb` command. You can also execute the SQL file through pgAdmin.

## Running the Server

Development mode:

```bash
npm run dev
```

Normal mode:

```bash
npm start
```

The server uses port `5000` by default, unless another value is configured in `.env`.

## Local URLs

- **API root:** http://localhost:5000/
- **Swagger UI:** http://localhost:5000/docs
- **Health check:** http://localhost:5000/api/v1/health

## API Routes

The Express application mounts these API areas:

| Module | Base Path |
|---|---|
| Books | `/api/v1/books` |
| Library Students | `/api/v1/library/students` |
| Library Faculty | `/api/v1/library/faculty` |
| Registrar | `/api/v1/registrar` |
| Loans | `/api/v1/loans` |
| Reservations | `/api/v1/reservations` |
| Fines | `/api/v1/fines` |
| Finance Payments | `/api/v1/finance/payments` |

The complete API contract is documented in `openapi.yaml`.

## Source Code Structure

- `src/index.js` — Configures Express, middleware, API route mounts, Swagger UI, and the health-check endpoint.
- `src/config/` — Database connection configuration.
- `src/routes/` — API route handlers.
- `src/services/` — Business logic and validation.
- `src/data/` — Data-access repositories.
- `database/library_schema.sql` — PostgreSQL schema.
- `openapi.yaml` — OpenAPI documentation.

## Testing the API

1. Start PostgreSQL.
2. Confirm the database settings in `.env`.
3. Start the server.
4. Open http://localhost:5000/docs.
5. Execute an endpoint using Swagger UI.
6. Check the HTTP status and response body.
7. Test invalid IDs and request data when applicable.

Only report endpoints as working after they have been tested.

## Troubleshooting

### Database connection failed

- Confirm PostgreSQL is running.
- Check the database name, username, password, host, and port.
- Confirm the database exists.
- Confirm that the SQL schema has been applied.

### Missing dependencies

Run:

```bash
npm install
```

### Port already in use

Change the `PORT` value in `.env`, then restart the server.

### Swagger UI does not open

Check that the server started successfully and that `openapi.yaml` contains valid YAML.

## Security Notes

- Never commit database credentials.
- Keep `.env` private.
- Use `.env.example` to document required variables.
- Avoid putting passwords, tokens, or other secrets in screenshots or documentation.