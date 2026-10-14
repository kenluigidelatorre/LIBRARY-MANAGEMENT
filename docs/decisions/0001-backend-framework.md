# ADR 0001: Backend Framework

- **Status:** Accepted
- **Date:** 2026-10-14
- **Decision Makers:** Library Management Module Team

## 1. Context

The Library Management Module requires a backend to expose REST API endpoints, process HTTP requests, and manage library-related data. The backend must support communication with the frontend and provide an organized structure for implementing application logic and database access.

The instructor recommended Node.js with Express. The team was also familiar with JavaScript, making it a suitable option for the project's backend implementation.

## 2. Decision

The team agreed during a team discussion to use **Node.js with Express** as the backend framework for the Library Management Module.

The primary considerations were the team's familiarity with JavaScript and Express's support for developing REST APIs.

The current implementation organizes backend responsibilities into routes, services, and repositories. This structure is intended to improve code organization and maintainability.

PostgreSQL is used for most library data because the module manages related entities and relational data. Database configuration is supplied through environment variables.

## 3. Alternatives Considered

The team selected Express directly and did not conduct a formal comparison of alternative backend frameworks.

Other frameworks could also support REST API development, but no specific alternatives were evaluated as part of the documented decision.

## 4. Consequences

### Positive Consequences

- Supports the development of REST API endpoints.
- Allows the team to use its existing JavaScript knowledge.
- Separates routing, business logic, and data-access responsibilities.
- Supports structured storage of related library entities through PostgreSQL.
- Provides a clear organization for maintaining backend code.

### Trade-offs and Risks

- The team must maintain consistent error-handling conventions across endpoints.
- API behavior and error responses need appropriate testing.
- Routes, services, and repositories must remain organized as the application grows.
- Database credentials and other environment-specific settings must be managed securely.

## 5. Implementation Notes

The current backend uses CommonJS modules and provides its application entry point at `server/src/index.js`.

The backend package defines the following commands:

- `npm start` — starts the server using `node src/index.js`.
- `npm run dev` — starts the server using Nodemon for development.

The server configuration uses environment variables for the application port and PostgreSQL connection settings.

## 6. References

- `server/package.json`
- `server/src/index.js`
- `server/openapi.yaml`
- `server/.env.example`
- `docs/architecture.md`
