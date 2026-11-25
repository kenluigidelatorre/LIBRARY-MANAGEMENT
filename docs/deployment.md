# Deployment Guide

## 1. Overview

The Library Management System consists of a React frontend and a Node.js/Express backend.

The frontend is configured for deployment through Vercel. The backend requires a Node.js hosting environment and a PostgreSQL database.

The repository includes a GitHub Actions workflow for continuous integration (CI). The workflow builds the frontend and checks the backend JavaScript syntax. It does not automatically deploy either application.

## 2. Frontend Deployment

### 2.1 Platform and Configuration

The frontend is configured for Vercel deployment.

| Setting | Value |
|---|---|
| Framework | React with Vite |
| Root directory | `client` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Development command | `npm run dev` |

The Vercel configuration is stored in `client/vercel.json`.

It includes a rewrite rule that directs incoming routes to `index.html`. This supports client-side navigation when users directly open or refresh React Router routes.

### 2.2 Environment Variables

The frontend uses the following environment variables from `client/.env.example`:

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API |
| `GEMINI_API_KEY` | API key for the Gemini integration |
| `APP_URL` | Application URL used by the frontend environment |

The default backend API URL is `http://localhost:5000/api`.

For deployment, configure `VITE_API_BASE_URL` with the publicly accessible backend API address. Do not use `localhost` for a separately hosted backend.

Configure sensitive values through the hosting platform's environment-variable settings. Do not commit actual credentials or API keys to Git.

### 2.3 Deployment Steps

1. Push the frontend changes to the GitHub repository.
2. Create or open the Vercel project connected to the repository.
3. Set the Root Directory to `client`.
4. Configure the build command as `npm run build`.
5. Set the output directory to `dist`.
6. Configure the required environment variables.
7. Deploy the frontend.
8. Open the deployed application and verify that its pages load correctly.
9. Test login and backend-dependent features after the backend API is available.

The actual Vercel project URL should be recorded after deployment.

## 3. Backend Deployment

### 3.1 Runtime and Configuration

The backend uses Node.js and Express 5 with CommonJS modules.

| Setting | Value |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Entry point | `src/index.js` |
| Production command | `npm start` |
| Development command | `npm run dev` |
| Database | PostgreSQL |

The backend package configuration is located in `server/package.json`.

### 3.2 Required Environment Variables

Configure the following variables in the backend hosting environment:

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the backend server |
| `DB_HOST` | PostgreSQL server hostname |
| `DB_PORT` | PostgreSQL server port |
| `DB_NAME` | Database name |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `REGISTRAR_MODE` | Registrar integration mode |
| `REGISTRAR_API_BASE_URL` | Registrar API base URL |
| `REGISTRAR_STUDENTS_PATH` | Registrar student endpoint path |
| `FINANCE_MODE` | Finance integration mode |
| `FINANCE_API_BASE_URL` | Finance API base URL |
| `FINANCE_PAYMENTS_PATH` | Finance payment endpoint path |
| `INTEGRATION_TIMEOUT_MS` | Integration request timeout |

The example values in `server/.env.example` are intended for local development. Replace local addresses and placeholder values with the actual production configuration.

Never commit production database credentials, API keys, or private environment files.

### 3.3 Deployment Steps

1. Prepare a PostgreSQL database on an accessible database host.
2. Configure the required database and integration environment variables.
3. Make sure the backend hosting environment can connect to the PostgreSQL database.
4. Install backend dependencies using `npm ci`.
5. Start the backend using `npm start`.
6. Check the API root, health endpoint, and Swagger UI.
7. Verify database connectivity and test the API endpoints.

The backend hosting provider and deployed API URL have not yet been confirmed in this documentation.

## 4. Frontend and Backend Connection

The frontend communicates with the backend through Axios.

The frontend environment variable `VITE_API_BASE_URL` must point to the deployed backend API.

The backend must also allow requests from the deployed frontend origin through its CORS configuration.

After deployment, verify the following:

- The frontend loads without errors.
- The backend health endpoint responds successfully.
- User authentication works.
- Books and other library records load from the API.
- Loan, reservation, fine, and payment operations work as expected.
- Registrar and Finance integrations use valid service addresses and endpoints.

A successful frontend build does not guarantee that the backend is reachable or that all API integrations are operational.

## 5. Continuous Integration

The repository uses GitHub Actions for continuous integration.

Workflow file: `.github/workflows/ci.yml`

The workflow contains two jobs:

| Job | Checks |
|---|---|
| Frontend Build | Installs frontend dependencies using `npm ci` and runs `npm run build` |
| Backend Syntax Check | Installs backend dependencies and checks JavaScript syntax using `node --check` |

The workflow runs on pushes to `main`, `develop`, and `feature/database-setup`, and on pull requests targeting `main` or `develop`.

This workflow validates parts of the application but does not perform automatic deployment.

## 6. Deployment Verification

After deployment, verify the following:

| Component | Verification |
|---|---|
| Frontend | Deployed URL opens successfully |
| Frontend routing | Direct navigation and page refresh work |
| Backend | API root responds |
| Health endpoint | `/api/v1/health` returns the expected health response |
| Swagger UI | `/docs` opens successfully |
| Database | Backend can connect to PostgreSQL |
| Authentication | Login and authenticated requests work |
| API integration | Frontend requests reach the correct backend endpoints |
| External modules | Registrar and Finance integrations use valid configurations |

## 7. Deployment Information

The following information should be completed when the deployment environments are confirmed.

| Item | Status |
|---|---|
| Frontend hosting platform | Vercel configuration present |
| Frontend deployed URL | To be recorded |
| Backend hosting platform | To be confirmed |
| Backend deployed URL | To be recorded |
| Production database host | To be confirmed |
| Production environment variables | To be configured securely |
| Automatic deployment workflow | Not configured in the current CI workflow |

## 8. Maintenance and Security Notes

- Keep production environment variables outside the Git repository.
- Do not expose database passwords or private API credentials.
- Keep frontend and backend API URLs synchronized.
- Verify CORS settings whenever the frontend domain changes.
- Keep the OpenAPI specification consistent with the implemented backend routes.
- Test authentication and database connectivity after deployment changes.
- Review GitHub Actions results before merging changes.