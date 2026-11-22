# IDSC Library Management System — Client (Frontend)

> **Midterm deliverable:** high-fidelity, clickable Figma prototype (no code).
> Module: **Library System** — part of the College Management System of Infotech Development Systems Colleges (IDSC).

A web-based library management system that lets administrators manage students, faculty, books, borrowing, returns, reservations, and fines from one dashboard.

## Table of Contents

- [High-Fidelity Prototype](#high-fidelity-prototype)
- [Design System](#design-system)
- [Features Covered](#features-covered)
- [Library Policy Defaults](#library-policy-defaults)
- [Flows (start to finish)](#flows-start-to-finish)
- [States Shown](#states-shown)
- [Screen Sizes](#screen-sizes)
- [Sample Data Formats](#sample-data-formats)
- [Screens](#screens)
- [API Mapping](#api-mapping)
- [Consistency Check](#consistency-check)
- [Project Structure](#project-structure)
- [Environment](#environment)
- [Getting Started](#getting-started)
- [Team](#team)

## High-Fidelity Prototype

| Item | Link / Detail |
|------|---------------|
| Figma prototype (Present mode) | `https://www.figma.com/proto/WZ9KzDGJjEfuc3BAhKxhdZ/Project-SIA?node-id=11-197&t=dEjuYwYnczGecc57-1&scaling=contain&content-scaling=fixed&page-id=0%3A1` |
| Figma design file | `https://www.figma.com/design/WZ9KzDGJjEfuc3BAhKxhdZ/Project-SIA?node-id=1116-8956&t=LSvteTXjaS9zUTTx-1` |
| Starting screen | Login → Dashboard |
| Access | Anyone with the link can view |

## Design System

All screens use the **shared class design system** (colors, typography, spacing, corner radius, shadows, and components). No new colors, fonts, or styles were created for this module.

- **Colors:** green primary palette with mint backgrounds; semantic colors for success, warning, error, and info
- **Typography:** DM Sans, with heading sizes from 48pt down to 11pt
- **Components:** sidebar, top bar, cards, tables, status badges, buttons, form fields, modals, and confirmation dialogs

## Features Covered

### Authentication
- Create an account (full name, email, password, confirm password)
- Log in, with an optional "Remember me"
- Forgot password link and show / hide password toggle

### Dashboard
- Greeting banner for the signed-in admin
- Summary cards, Recent Borrowing Activity table, and Borrowing Analytics chart

### Library Students
- Searchable list with **All / Active / Inactive** filters
- Columns: ID, Name, Email, Program, Year, Status, Action
- Edit and delete actions per record

### Faculties
- Searchable list with **All / Active / Inactive** filters
- Columns: Faculty ID, Name, Email, Department, Status, Action

### Books
- Add, edit, and delete books
- Fields: Book Title, Author, Category, ISBN, Total (copies), Year of Publication

### Borrowing
- Borrow Book action, summary cards, and filters (Active, Overdue, Returned)
- Borrowing records table with status badges and a delete confirmation dialog

### Returns
- Record returned books and update the loan status

### Reservations
- Reserve books and manage reservations; reservations expire after the configured number of days

### Fines
- Summary cards: Total Fines, Total Unpaid, Overdue Students
- Filters: **All / Paid / Unpaid**
- Columns: Fine ID, Book Title, Name, Type, Days Late, Amount, Issued

### Reports & Analytics
- Summary cards: Total Borrowings, Total Returns, Overdue Rate, Fine Collection
- Report tabs: **Borrowing, Returns, Overdue, Reservations, Fines**
- Charts: Borrowing Trend (Monthly), Books Borrowed by Category, Fines Collection (Monthly), and a Top Borrowers ranking

### Settings
- **System Information:** library name, email, contact number, address
- **Notifications:** email, SMS, and overdue alert toggles
- **Library Policy:** fine rate, loan period, max books, reservation expiry
- **Account & Security:** change password

## Library Policy Defaults

Configurable in **Settings → Library Policy**:

| Setting | Default |
|---------|---------|
| Fine rate per day | ₱10.00 |
| Default loan period | 14 days |
| Max books per person | 5 |
| Reservation expiry | 7 days |

## Flows (start to finish)

| Feature | Flow |
|---------|------|
| Authentication | Create an account → Log in → Dashboard |
| Books | Books list → Book details → Edit book → Save changes → Success message |
| Books | Books list → Add book → Save changes → Success message |
| Books | Books list → Delete → Confirmation dialog → Delete → Success message |
| Library Students | Students list → Student details |
| Faculties | Faculties list → Faculty details |
| Borrowing | Borrowing list → Borrow book form → Confirm → Success message |
| Returns | Returns list → Return form → Fine shown if overdue → Success message |
| Reservations | Reservations list → Reserve book → Cancel reservation → Confirmation dialog |
| Fines | Fines list → Fine details → Mark as paid → Success message |
| Reports | Reports → Switch report tab → View charts |
| Settings | Settings → Edit a setting → Save changes → Success message |

## States Shown

- Loading (skeleton rows)
- Empty (no results found)
- Error (failed to load, with Retry)
- Form validation errors
- Confirmation dialogs for delete and cancel actions

## Screen Sizes

- Desktop version of every main screen
- Phone-width version of the main screens (dashboard, one list screen, one form)

## Sample Data Formats

- Student ID: `2026-00123` (as defined in `integration.md`)
- Dates: `Sep 25, 2026`
- Money: `₱1,500.00`

## Screens

Exported images are in [`screens/`](screens/) (`desktop/` and `mobile/`).

| Screen | Purpose |
|--------|---------|
| Create an Account / Log in | Authentication |
| Dashboard | Overview of library activity |
| Library Students | Manage student library records |
| Faculties | Manage faculty library records |
| Books | Manage the book catalog |
| Borrowing | Track borrowed books |
| Returns | Process returned books |
| Reservations | Manage book reservations |
| Fines | Track overdue fines and payments |
| Reports & Analytics | Borrowing, returns, overdue, and fine reports |
| Settings | System information, notifications, policy, and account |

## API Mapping

Every field shown on a screen exists in [`openapi.yaml`](../openapi.yaml). See [`field-mapping.md`](field-mapping.md).

The API covers Books, Library Students, Faculties, Loans (borrowing and returns), Reservations, Fines, and Registrar integration.

## Consistency Check

Compared with other groups' prototypes. See [`consistency-check.md`](consistency-check.md).

## Project Structure

> Adjust this tree to match the actual repository.

```
.
├── README.md
├── openapi.yaml
├── integration.md
├── client/
│   ├── README.md
│   ├── .env.example
│   ├── screens/
│   │   ├── desktop/
│   │   └── mobile/
│   ├── field-mapping.md
│   └── consistency-check.md
└── server/
```

## Environment

`.env.example` is reserved for the future code implementation (e.g., API base URL). It is not needed for the Figma prototype.





