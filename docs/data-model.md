# Data Model

## 1. Overview

The Library Management System backend uses PostgreSQL as its relational database.

The database schema is defined in:

`server/database/library_schema.sql`

The database contains seven main tables:

- `books`
- `library_students`
- `library_faculty`
- `loans`
- `reservations`
- `fines`
- `finance_payments`

The schema also defines primary keys, foreign keys, check constraints, and indexes to maintain data integrity and improve query performance.

---

## 2. Entity Relationship Overview

The main database relationships are:

```text
books
  |
  +---- loans
  |       |
  |       +---- fines
  |               |
  |               +---- finance_payments
  |
  +---- reservations

library_students
  |
  +---- logically referenced by borrower_id + borrower_type

library_faculty
  |
  +---- logically referenced by borrower_id + borrower_type