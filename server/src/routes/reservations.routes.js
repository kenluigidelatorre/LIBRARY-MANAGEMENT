const express = require("express");
const reservationService = require("../services/reservations.service");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const reservations = await reservationService.getReservations({
            borrowerType: req.query.borrowerType,
            borrowerId: req.query.borrowerId
        });

        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve reservations"
        });
    }
});

router.get("/:reservationId", async (req, res) => {
    try {
        const reservation = await reservationService.getReservation(
            req.params.reservationId
        );

        if (!reservation) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Reservation not found"
            });
        }

        res.status(200).json(reservation);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve reservation"
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const reservation = await reservationService.addReservation(req.body);

        res.status(201).json(reservation);
    } catch (error) {
        console.error(error);

        if (error.message === "BOOK_NOT_FOUND") {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Book not found"
            });
        }

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to create reservation"
        });
    }
});

router.delete("/:reservationId", async (req, res) => {
    try {
        const reservation = await reservationService.removeReservation(
            req.params.reservationId
        );

        if (!reservation) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Reservation not found"
            });
        }

        res.status(200).json({
            message: "Reservation deleted successfully",
            reservationId: reservation.reservationId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to delete reservation"
        });
    }
});

module.exports = router;