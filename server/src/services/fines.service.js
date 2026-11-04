const fineRepository = require("../data/fines.repository");

const getFines = async (filters) => fineRepository.getAllFines(filters);
const getFine = async (fineId) => fineRepository.getFineById(fineId);

const addFine = async (fine) => {
    if (!fine || !fine.borrowerId || !fine.reason || !Number.isFinite(Number(fine.amount)) || Number(fine.amount) <= 0) {
        throw new Error("INVALID_FINE_INPUT");
    }
    const borrowerType = String(fine.borrowerType || "").toUpperCase();
    if (!["STUDENT", "FACULTY"].includes(borrowerType)) throw new Error("INVALID_BORROWER_TYPE");
    return fineRepository.createFine({ ...fine, borrowerType, amount: Number(fine.amount) });
};

const updateFine = async (fineId, fine) => fineRepository.updateFine(fineId, fine);

module.exports = { getFines, getFine, addFine, updateFine };
