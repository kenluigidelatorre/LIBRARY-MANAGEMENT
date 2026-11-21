const request = async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutMs = Number(process.env.INTEGRATION_TIMEOUT_MS || 8000);
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                Accept: "application/json",
                ...(options.body ? { "Content-Type": "application/json" } : {}),
                ...(options.headers || {})
            }
        });

        const raw = await response.text();
        let data = null;
        if (raw) {
            try {
                data = JSON.parse(raw);
            } catch {
                throw new Error("INTEGRATION_INVALID_JSON");
            }
        }

        if (!response.ok) {
            const error = new Error("INTEGRATION_REQUEST_FAILED");
            error.status = response.status;
            error.details = data;
            throw error;
        }

        return data;
    } catch (error) {
        if (error.name === "AbortError") {
            const timeoutError = new Error("INTEGRATION_TIMEOUT");
            timeoutError.status = 504;
            throw timeoutError;
        }
        if (error.message === "INTEGRATION_REQUEST_FAILED" || error.message === "INTEGRATION_INVALID_JSON") {
            throw error;
        }
        const unavailable = new Error("INTEGRATION_UNAVAILABLE");
        unavailable.status = 502;
        throw unavailable;
    } finally {
        clearTimeout(timeout);
    }
};

module.exports = { request };
