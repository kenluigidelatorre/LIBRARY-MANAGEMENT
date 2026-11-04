const loanRepository = require("../data/loans.repository");
const registrarService = require("./registrar.service");

const getLoans = async (filters) => loanRepository.getAllLoans(filters);
const getLoan = async (loanId) => loanRepository.getLoanById(loanId);

const addLoan = async (loan) => {
    validateLoan(loan);
    if (loan.borrowerType === "STUDENT") {
        await registrarService.verifyStudentEligibility(loan.borrowerId);
    }
    return loanRepository.createLoan(loan);
};

const updateLoan = async (loanId, loan) => {
    if (!loan || !["RETURNED", "OVERDUE", "BORROWED"].includes(String(loan.status || "").toUpperCase())) {
        throw new Error("INVALID_LOAN_STATUS");
    }
    if (String(loan.status).toUpperCase() === "RETURNED" && !isDate(loan.returnedDate || new Date().toISOString().slice(0, 10))) {
        throw new Error("INVALID_RETURN_DATE");
    }
    return loanRepository.updateLoan(loanId, {
        status: String(loan.status).toUpperCase(),
        returnedDate: String(loan.status).toUpperCase() === "RETURNED"
            ? (loan.returnedDate || new Date().toISOString().slice(0, 10))
            : null
    });
};

const removeLoan = async (loanId) => loanRepository.deleteLoan(loanId);

function isDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function validateLoan(loan) {
    if (!loan || !loan.borrowerId || !loan.bookId) throw new Error("INVALID_LOAN_INPUT");
    if (!["STUDENT", "FACULTY"].includes(String(loan.borrowerType || "").toUpperCase())) throw new Error("INVALID_BORROWER_TYPE");
    const borrowedDate = loan.borrowedDate || new Date().toISOString().slice(0, 10);
    const dueDate = loan.dueDate;
    if (!isDate(borrowedDate) || !isDate(dueDate) || dueDate < borrowedDate) throw new Error("INVALID_LOAN_DATES");
    loan.borrowedDate = borrowedDate;
    loan.borrowerType = String(loan.borrowerType).toUpperCase();
}

module.exports = { getLoans, getLoan, addLoan, updateLoan, removeLoan };
