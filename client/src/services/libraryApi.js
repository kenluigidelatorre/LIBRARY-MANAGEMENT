import api from "./api";

function toTitleCase(value, fallback = "Active") {
  if (!value) return fallback;
  const upper = String(value).toUpperCase();
  const map = {
    AVAILABLE: "Available",
    UNAVAILABLE: "Unavailable",
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    BLOCKED: "Inactive",
    ENROLLED: "Active",
    BORROWED: "Borrowed",
    RETURNED: "Returned",
    OVERDUE: "Overdue",
    PENDING: "Pending",
    FULFILLED: "Completed",
    CANCELLED: "Cancelled",
    UNPAID: "Unpaid",
    PAID: "Paid",
    WAIVED: "Waived",
    STUDENT: "Student",
    FACULTY: "Faculty",
  };
  return map[upper] || value;
}

function formatDateOnly(val) {
  if (!val) return "";
  return String(val).slice(0, 10);
}

export function mapBookFromServer(row) {
  const copies = Number(row.quantity ?? row.copies ?? 0);
  const available = Number(
    row.availableQuantity ?? row.available_quantity ?? copies,
  );

  let status = toTitleCase(row.status, "Available");

  if (available === 0) {
    status = "Unavailable";
  } else if (available <= 2 && copies > 2) {
    status = "Low Stock";
  }

  return {
    id: row.bookId || row.book_id || row.id,
    title: row.title || "",
    author: row.author || "",
    isbn: row.isbn || "",
    category: row.category || "General",
    publisher: row.publisher || "",
    year: Number(row.publicationYear ?? row.publication_year ?? 2024),
    copies,
    available,
    status,
  };
}

// Only send book details and total quantity.
// The backend calculates available copies and inventory status.
export function mapBookToServer(book) {
  return {
    title: book.title,
    author: book.author,
    isbn: book.isbn || "",
    category: book.category || "",
    publisher: book.publisher || "",
    publicationYear: book.year ? Number(book.year) : undefined,
    quantity: Number(book.copies ?? book.quantity ?? 0),
  };
}

export function mapStudentFromServer(row) {
  return {
    id: row.studentId || row.student_id || row.id,
    name: row.name || "",
    email:
      row.email ||
      `${String(row.studentId || "student").toLowerCase()}@cmd.edu`,
    program: row.program || row.departmentOrProgram || "General Studies",
    year: row.yearLevel || row.year_level || "1st Year",
    status: toTitleCase(
      row.libraryStatus || row.library_status || row.status,
      "Active",
    ),
  };
}

export function mapFacultyFromServer(row) {
  return {
    id: row.facultyId || row.faculty_id || row.id,
    name: row.name || "",
    email: row.email || "",
    department: row.department || "",
    status: toTitleCase(
      row.libraryStatus || row.library_status || row.status,
      "Active",
    ),
  };
}

export function mapLoanFromServer(row, lookup = {}) {
  const book = lookup.booksById?.[row.bookId];
  const role = toTitleCase(row.borrowerType, "Student");

  const member =
    role === "Faculty"
      ? lookup.facultyById?.[row.borrowerId]
      : lookup.studentsById?.[row.borrowerId];

  return {
    id: row.loanId || row.loan_id || row.id,
    bookId: row.bookId || row.book_id,
    bookTitle: book?.title || row.bookTitle || row.bookId,
    borrowerId: row.borrowerId || row.borrower_id,
    borrowerName: member?.name || row.borrowerName || row.borrowerId,
    role,
    borrowDate: formatDateOnly(row.borrowedDate || row.borrowed_date),
    dueDate: formatDateOnly(row.dueDate || row.due_date),
    returnedDate: formatDateOnly(row.returnedDate || row.returned_date) || null,
    status: toTitleCase(row.status, "Borrowed"),
  };
}

export function mapReservationFromServer(row, lookup = {}) {
  const book = lookup.booksById?.[row.bookId];
  const role = toTitleCase(row.borrowerType, "Student");

  const member =
    role === "Faculty"
      ? lookup.facultyById?.[row.borrowerId]
      : lookup.studentsById?.[row.borrowerId];

  const reservedDate = formatDateOnly(
    row.reservationDate || row.reservation_date,
  );

  const expiryDate = reservedDate
    ? new Date(new Date(reservedDate).getTime() + 7 * 86400000)
        .toISOString()
        .slice(0, 10)
    : "";

  return {
    id: row.reservationId || row.reservation_id || row.id,
    bookId: row.bookId || row.book_id,
    bookTitle: book?.title || row.bookTitle || row.bookId,
    borrowerId: row.borrowerId || row.borrower_id,
    borrowerName: member?.name || row.borrowerName || row.borrowerId,
    role,
    reservedDate,
    expiryDate,
    status: toTitleCase(row.status, "Pending"),
  };
}

export function mapFineFromServer(row, lookup = {}) {
  const role = toTitleCase(row.borrowerType, "Student");

  const member =
    role === "Faculty"
      ? lookup.facultyById?.[row.borrowerId]
      : lookup.studentsById?.[row.borrowerId];

  const loan = row.loanId ? lookup.loansById?.[row.loanId] : null;

  const book = loan ? lookup.booksById?.[loan.bookId] : null;

  return {
    id: row.fineId || row.fine_id || row.id,
    borrowerId: row.borrowerId || row.borrower_id,
    borrowerType: String(row.borrowerType || "STUDENT").toUpperCase(),
    loanId: row.loanId || row.loan_id || null,
    borrowerName: member?.name || row.borrowerName || row.borrowerId,
    bookTitle:
      book?.title ||
      row.bookTitle ||
      (row.loanId ? `Loan ${row.loanId}` : "Library Account"),
    reason: row.reason || "",
    daysLate: Number(row.daysLate ?? 0),
    amount: Number(row.amount ?? 0),
    status: toTitleCase(row.status, "Unpaid"),
    assessedDate: row.assessedDate || new Date().toISOString().slice(0, 10),
  };
}

export const libraryApi = {
  async checkHealth() {
  const { data } = await api.get('/v1/health');
  return data;
},

  async fetchBooks() {
    const { data } = await api.get("/books");
    return (Array.isArray(data) ? data : data?.data || []).map(
      mapBookFromServer,
    );
  },

  async createBook(book) {
    const { data } = await api.post("/books", mapBookToServer(book));

    return mapBookFromServer(data);
  },

  async updateBook(bookId, book) {
    const { data } = await api.put(
      `/books/${encodeURIComponent(bookId)}`,
      mapBookToServer(book),
    );

    return mapBookFromServer(data);
  },

  async deleteBook(bookId) {
    const { data } = await api.delete(`/books/${encodeURIComponent(bookId)}`);

    return data;
  },

  async fetchStudents() {
    try {
      const { data } = await api.get("/registrar/students");

      const list = Array.isArray(data) ? data : data?.data || [];

      if (list.length > 0) {
        return list.map(mapStudentFromServer);
      }
    } catch {
      // Fallback to /library/students if /registrar/students is unavailable
    }

    const { data } = await api.get("/library/students");

    const list = Array.isArray(data) ? data : data?.data || [];

    return list.map(mapStudentFromServer);
  },

  async fetchFaculty() {
    const { data } = await api.get("/library/faculty");

    const list = Array.isArray(data) ? data : data?.data || [];

    return list.map(mapFacultyFromServer);
  },

  async fetchLoans(filters = {}) {
    const { data } = await api.get("/loans", {
      params: filters,
    });

    return Array.isArray(data) ? data : data?.data || [];
  },

  async createLoan({
    borrowerId,
    borrowerType,
    bookId,
    borrowedDate,
    dueDate,
  }) {
    const { data } = await api.post("/loans", {
      borrowerId,
      borrowerType: String(borrowerType).toUpperCase(),
      bookId,
      borrowedDate,
      dueDate,
    });

    return data;
  },

  async updateLoan(loanId, { status, returnedDate }) {
    const { data } = await api.put(`/loans/${encodeURIComponent(loanId)}`, {
      status: String(status).toUpperCase(),
      returnedDate: returnedDate || new Date().toISOString().slice(0, 10),
    });

    return data;
  },

  async deleteLoan(loanId) {
    const { data } = await api.delete(`/loans/${encodeURIComponent(loanId)}`);

    return data;
  },

  async fetchReservations(filters = {}) {
    const { data } = await api.get("/reservations", {
      params: filters,
    });

    return Array.isArray(data) ? data : data?.data || [];
  },

  async createReservation({ borrowerId, borrowerType, bookId }) {
    const { data } = await api.post("/reservations", {
      borrowerId,
      borrowerType: String(borrowerType).toUpperCase(),
      bookId,
    });

    return data;
  },

  async deleteReservation(reservationId) {
    const { data } = await api.delete(
      `/reservations/${encodeURIComponent(reservationId)}`,
    );

    return data;
  },

  async fetchFines(filters = {}) {
    const { data } = await api.get("/fines", {
      params: filters,
    });

    return Array.isArray(data) ? data : data?.data || [];
  },

  async createFine({ borrowerId, borrowerType, loanId, amount, reason }) {
    const { data } = await api.post("/fines", {
      borrowerId,
      borrowerType: String(borrowerType).toUpperCase(),
      loanId: loanId || undefined,
      amount: Number(amount),
      reason,
    });

    return data;
  },

  async updateFineStatus(fineId, status) {
    const { data } = await api.put(`/fines/${encodeURIComponent(fineId)}`, {
      status: String(status).toUpperCase(),
    });

    return data;
  },

  async fetchPayments(filters = {}) {
    const { data } = await api.get("/finance/payments", {
      params: filters,
    });

    return Array.isArray(data) ? data : data?.data || [];
  },

  async payFine({
    fineId,
    borrowerId,
    borrowerType,
    amount,
    paymentMethod = "CASH",
    paymentReference = null,
  }) {
    const { data } = await api.post("/finance/payments", {
      fineId,
      borrowerId,
      borrowerType: String(borrowerType).toUpperCase(),
      amount: Number(amount),
      paymentMethod,
      ...(paymentReference ? { paymentReference } : {}),
    });

    return data;
  },

  async loadAll() {
    const [
      books,
      studentsRes,
      facultyRes,
      rawLoans,
      rawReservations,
      rawFines,
      payments,
    ] = await Promise.all([
      this.fetchBooks(),
      this.fetchStudents().catch(() => []),
      this.fetchFaculty().catch(() => []),
      this.fetchLoans(),
      this.fetchReservations(),
      this.fetchFines(),
      this.fetchPayments().catch(() => []),
    ]);

    const booksById = Object.fromEntries(books.map((book) => [book.id, book]));

    const studentsById = Object.fromEntries(
      studentsRes.map((student) => [student.id, student]),
    );

    const facultyById = Object.fromEntries(
      facultyRes.map((member) => [member.id, member]),
    );

    const lookup = {
      booksById,
      studentsById,
      facultyById,
    };

    const borrowings = rawLoans.map((loan) => mapLoanFromServer(loan, lookup));

    const loansById = Object.fromEntries(
      borrowings.map((loan) => [loan.id, loan]),
    );

    const reservations = rawReservations.map((reservation) =>
      mapReservationFromServer(reservation, lookup),
    );

    const fines = rawFines.map((fine) =>
      mapFineFromServer(fine, {
        ...lookup,
        loansById,
      }),
    );

    const returns = borrowings
      .filter((loan) => loan.status === "Returned")
      .map((loan, idx) => {
        const isLate =
          loan.returnedDate && loan.dueDate && loan.returnedDate > loan.dueDate;

        const matchingFine = fines.find((fine) => fine.loanId === loan.id);

        return {
          id: `RET-${4001 + idx}`,
          borrowId: loan.id,
          bookTitle: loan.bookTitle,
          borrowerName: loan.borrowerName,
          borrowDate: loan.borrowDate,
          returnDate: loan.returnedDate || loan.dueDate,
          condition: "Good",
          status: isLate ? "Late" : "On Time",
          fineAmount: matchingFine ? Number(matchingFine.amount) : 0,
        };
      });

    return {
      books,
      students: studentsRes,
      faculty: facultyRes,
      borrowings,
      returns,
      reservations,
      fines,
      payments,
    };
  },
};
