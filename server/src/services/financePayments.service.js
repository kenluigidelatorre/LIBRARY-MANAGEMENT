
const paymentRepository = require("../data/financePayments.repository");
const fineRepository = require("../data/fines.repository");
const { request } = require("./httpClient");

const mode = () =>
    (process.env.FINANCE_MODE || "mock").toLowerCase();

function getFinancePaymentsUrl() {
    const base = process.env.FINANCE_API_BASE_URL;
    const path = process.env.FINANCE_PAYMENTS_PATH;

    if (!base) throw new Error("FINANCE_API_BASE_URL_REQUIRED");
    if (!path) throw new Error("FINANCE_PAYMENTS_PATH_REQUIRED");

    return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

async function getPayments(filters = {}) {
    return paymentRepository.getAllPayments(filters);
}

async function getPayment(paymentId) {
    return paymentRepository.getPaymentById(paymentId);
}

async function addPayment(payment) {
    const fine = await fineRepository.getFineById(payment.fineId);

    if (!fine) throw new Error("FINE_NOT_FOUND");
    if (fine.status === "PAID") throw new Error("FINE_ALREADY_PAID");
    if (fine.status === "WAIVED") throw new Error("FINE_WAIVED");

    if (
        String(fine.borrowerId) !== String(payment.borrowerId) ||
        fine.borrowerType !== payment.borrowerType
    ) {
        throw new Error("PAYMENT_BORROWER_MISMATCH");
    }

    if (Number(fine.amount) !== Number(payment.amount)) {
        throw new Error("PAYMENT_AMOUNT_MISMATCH");
    }

    if (mode() === "mock") {
        return {
            mode: "mock",
            simulated: true,
            status: "SIMULATED",
            message: "Mock payment only. No actual payment was recorded.",
            fineId: fine.fineId,
            borrowerId: fine.borrowerId,
            amount: fine.amount,
            paymentMethod: payment.paymentMethod
        };
    }

    if (mode() !== "live") {
        throw new Error("INVALID_FINANCE_MODE");
    }

    const response = await request(getFinancePaymentsUrl(), {
        method: "POST",
        body: JSON.stringify({
            fineId: payment.fineId,
            borrowerId: payment.borrowerId,
            borrowerType: payment.borrowerType,
            amount: Number(payment.amount),
            paymentMethod: payment.paymentMethod,
            paymentReference: payment.paymentReference || null
        })
    });

    const data = response?.data ?? response;

    const status = String(data?.status || "").toUpperCase();

    const transactionReference =
        data?.transactionReference ??
        data?.transaction_reference;

    if (status !== "CONFIRMED" || !transactionReference) {
        return {
            mode: "live",
            simulated: false,
            status: "PENDING",
            message: "Finance has not confirmed this payment.",
            fineId: fine.fineId,
            financeResponse: response
        };
    }

    return paymentRepository.recordConfirmedPayment({
        ...payment,
        paymentReference: String(transactionReference)
    });
}

module.exports = {
    getPayments,
    getPayment,
    addPayment,
    getMode: mode
};
