const paymentRepository = require("../data/financePayments.repository");

const getPayments = async (filters) => {
    return await paymentRepository.getAllPayments(filters);
};

const getPayment = async (paymentId) => {
    return await paymentRepository.getPaymentById(paymentId);
};

const addPayment = async (payment) => {
    return await paymentRepository.createPayment(payment);
};

module.exports = {
    getPayments,
    getPayment,
    addPayment
};