DROP TABLE IF EXISTS finance_payments CASCADE;
DROP TABLE IF EXISTS fines CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS library_faculty CASCADE;
DROP TABLE IF EXISTS library_students CASCADE;
DROP TABLE IF EXISTS books CASCADE;

CREATE TABLE books (
    book_id VARCHAR(20) PRIMARY KEY,
    isbn VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    publisher VARCHAR(255),
    publication_year INT,
    quantity INT NOT NULL DEFAULT 0,
    available_quantity INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT books_status_check
        CHECK (status IN ('AVAILABLE', 'UNAVAILABLE')),

    CONSTRAINT books_quantity_check
        CHECK (quantity >= 0),

    CONSTRAINT books_available_quantity_check
        CHECK (available_quantity >= 0),

    CONSTRAINT books_available_not_greater_than_quantity
        CHECK (available_quantity <= quantity)
);

CREATE TABLE library_students (
    student_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    program VARCHAR(255),
    year_level VARCHAR(50),
    library_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT library_students_status_check
        CHECK (library_status IN ('ACTIVE', 'INACTIVE', 'BLOCKED'))
);

CREATE TABLE library_faculty (
    faculty_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    library_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT library_faculty_status_check
        CHECK (library_status IN ('ACTIVE', 'INACTIVE', 'BLOCKED'))
);

CREATE TABLE loans (
    loan_id VARCHAR(20) PRIMARY KEY,
    borrower_id VARCHAR(20) NOT NULL,
    borrower_type VARCHAR(20) NOT NULL,
    book_id VARCHAR(20) NOT NULL,
    borrowed_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    returned_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'BORROWED',

    CONSTRAINT loans_borrower_type_check
        CHECK (borrower_type IN ('STUDENT', 'FACULTY')),

    CONSTRAINT loans_status_check
        CHECK (status IN ('BORROWED', 'RETURNED', 'OVERDUE')),

    CONSTRAINT loans_dates_check
        CHECK (returned_date IS NULL OR returned_date >= borrowed_date),

    CONSTRAINT loans_due_date_check
        CHECK (due_date >= borrowed_date),

    CONSTRAINT loans_book_fk
        FOREIGN KEY (book_id)
        REFERENCES books(book_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE reservations (
    reservation_id VARCHAR(20) PRIMARY KEY,
    borrower_id VARCHAR(20) NOT NULL,
    borrower_type VARCHAR(20) NOT NULL,
    book_id VARCHAR(20) NOT NULL,
    reservation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    CONSTRAINT reservations_borrower_type_check
        CHECK (borrower_type IN ('STUDENT', 'FACULTY')),

    CONSTRAINT reservations_status_check
        CHECK (status IN ('PENDING', 'FULFILLED', 'CANCELLED')),

    CONSTRAINT reservations_book_fk
        FOREIGN KEY (book_id)
        REFERENCES books(book_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE fines (
    fine_id VARCHAR(20) PRIMARY KEY,
    borrower_id VARCHAR(20) NOT NULL,
    borrower_type VARCHAR(20) NOT NULL,
    loan_id VARCHAR(20),
    amount NUMERIC(10,2) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'UNPAID',

    CONSTRAINT fines_borrower_type_check
        CHECK (borrower_type IN ('STUDENT', 'FACULTY')),

    CONSTRAINT fines_status_check
        CHECK (status IN ('UNPAID', 'PAID', 'WAIVED')),

    CONSTRAINT fines_amount_check
        CHECK (amount >= 0),

    CONSTRAINT fines_loan_fk
        FOREIGN KEY (loan_id)
        REFERENCES loans(loan_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE finance_payments (
    payment_id VARCHAR(20) PRIMARY KEY,
    fine_id VARCHAR(20) NOT NULL,
    borrower_id VARCHAR(20) NOT NULL,
    borrower_type VARCHAR(20) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_reference VARCHAR(100),
    paid_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PAID',

    CONSTRAINT finance_payments_borrower_type_check
        CHECK (borrower_type IN ('STUDENT', 'FACULTY')),

    CONSTRAINT finance_payments_method_check
        CHECK (payment_method IN ('CASH', 'GCASH', 'BANK_TRANSFER')),

    CONSTRAINT finance_payments_status_check
        CHECK (status IN ('PAID', 'REFUNDED')),

    CONSTRAINT finance_payments_amount_check
        CHECK (amount >= 0),

    CONSTRAINT finance_payments_fine_fk
        FOREIGN KEY (fine_id)
        REFERENCES fines(fine_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_loans_borrower
    ON loans(borrower_id, borrower_type);

CREATE INDEX idx_loans_book
    ON loans(book_id);

CREATE INDEX idx_loans_status
    ON loans(status);

CREATE INDEX idx_reservations_borrower
    ON reservations(borrower_id, borrower_type);

CREATE INDEX idx_reservations_book
    ON reservations(book_id);

CREATE INDEX idx_reservations_status
    ON reservations(status);

CREATE INDEX idx_fines_borrower
    ON fines(borrower_id, borrower_type);

CREATE INDEX idx_fines_status
    ON fines(status);

CREATE INDEX idx_finance_payments_fine
    ON finance_payments(fine_id);

CREATE INDEX idx_finance_payments_borrower
    ON finance_payments(borrower_id, borrower_type);