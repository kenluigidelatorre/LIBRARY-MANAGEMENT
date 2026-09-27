const reservationRepository = require("../data/reservations.repository");

const getReservations = async (filters) => {
    return await reservationRepository.getAllReservations(filters);
};

const getReservation = async (reservationId) => {
    return await reservationRepository.getReservationById(reservationId);
};

const addReservation = async (reservation) => {
    return await reservationRepository.createReservation(reservation);
};

const removeReservation = async (reservationId) => {
    return await reservationRepository.deleteReservation(reservationId);
};

module.exports = {
    getReservations,
    getReservation,
    addReservation,
    removeReservation
};