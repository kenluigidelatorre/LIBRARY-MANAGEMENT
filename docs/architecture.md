@'
# Backend Architecture

## 1. Overview

The Library Management System backend is a Node.js and Express REST API.

The backend is organized into routes, services, and repositories. Most application data is stored in PostgreSQL. The Registrar module currently uses an in-memory data source.

The backend also provides Swagger UI documentation based on the `server/openapi.yaml` specification.

## 2. Technology Stack

The backend uses the following technologies:

- Node.js
- Express 5
- PostgreSQL
- `pg` PostgreSQL client
- CORS
- dotenv
- Swagger UI Express
- YAML
- Nodemon for development

The backend uses CommonJS modules.

## 3. Backend Structure

The main backend structure is:

```text
server/
|-- src/
|   |-- config/
|   |   `-- database.js
|   |-- data/
|   |   |-- books.repository.js
|   |   |-- libraryStudents.repository.js
|   |   |-- libraryFaculty.repository.js
|   |   |-- registrar.repository.js
|   |   |-- loans.repository.js
|   |   |-- reservations.repository.js
|   |   |-- fines.repository.js
|   |   `-- financePayments.repository.js
|   |-- routes/
|   |   |-- books.routes.js
|   |   |-- libraryStudents.routes.js
|   |   |-- libraryFaculty.routes.js
|   |   |-- registrar.routes.js
|   |   |-- loans.routes.js
|   |   |-- reservations.routes.js
|   |   |-- fines.routes.js
|   |   `-- financePayments.routes.js
|   |-- services/
|   |   |-- bookService.js
|   |   |-- libraryStudents.service.js
|   |   |-- libraryFaculty.service.js
|   |   |-- registrar.service.js
|   |   |-- loanService.js
|   |   |-- reservations.service.js
|   |   |-- fines.service.js
|   |   `-- financePayments.service.js
|   `-- index.js
|-- openapi.yaml
`-- package.json