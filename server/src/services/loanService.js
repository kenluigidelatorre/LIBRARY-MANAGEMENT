const loanRepository = require("../data/loans.repository");

const getLoans = async (filters) => {
    return await loanRepository.getAllLoans(filters);
};

const getLoan = async (loanId) => {
    return await loanRepository.getLoanById(loanId);
};

const addLoan = async (loan) => {
    return await loanRepository.createLoan(loan);
};

const updateLoan = async (loanId, loan) => {
    return await loanRepository.updateLoan(loanId, loan);
};

const removeLoan = async (loanId) => {
    return await loanRepository.deleteLoan(loanId);
};

module.exports = {
    getLoans,
    getLoan,
    addLoan,
    updateLoan,
    removeLoan
};
