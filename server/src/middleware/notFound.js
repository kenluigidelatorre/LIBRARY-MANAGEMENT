function notFound(req, res, next) {
    res.status(404).json({
        status: "error",
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        data: null
    });
}

module.exports = notFound;