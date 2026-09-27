const fineRepository = require("../data/fines.repository");

const getFines = async (filters) => {
    return await fineRepository.getAllFines(filters);
};

const getFine = async (fineId) => {
    return await fineRepository.getFineById(fineId);
};

const addFine = async (fine) => {
    return await fineRepository.createFine(fine);
};

const updateFine = async (fineId, fine) => {
    return await fineRepository.updateFine(fineId, fine);
};

module.exports = {
    getFines,
    getFine,
    addFine,
    updateFine
};