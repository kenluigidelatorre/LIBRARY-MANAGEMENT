const reservationRepository = require("../data/reservations.repository");
const registrarService = require("./registrar.service");

const getReservations = async (filters) => reservationRepository.getAllReservations(filters);
const getReservation = async (reservationId) => reservationRepository.getReservationById(reservationId);

const addReservation = async (reservation) => {
    if (!reservation || !reservation.borrowerId || !reservation.bookId) throw new Error("INVALID_RESERVATION_INPUT");
    const borrowerType = String(reservation.borrowerType || "").toUpperCase();
    if (!["STUDENT", "FACULTY"].includes(borrowerType)) throw new Error("INVALID_BORROWER_TYPE");
    if (borrowerType === "STUDENT") await registrarService.verifyStudentEligibility(reservation.borrowerId);
    return reservationRepository.createReservation({ ...reservation, borrowerType });
};

const removeReservation = async (reservationId) => reservationRepository.deleteReservation(reservationId);

module.exports = { getReservations, getReservation, addReservation, removeReservation };
