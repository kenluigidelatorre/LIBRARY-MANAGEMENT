const getGatewayBaseUrl = () => {
    const value = process.env.GATEWAY_BASE_URL;
    if (!value) throw new Error("GATEWAY_BASE_URL_REQUIRED");
    return value.replace(/\/$/, "");
};

const getGatewayUrl = (pathValue) => {
    if (!pathValue) throw new Error("GATEWAY_ROUTE_REQUIRED");
    const path = String(pathValue).startsWith("/") ? String(pathValue) : `/${pathValue}`;
    return `${getGatewayBaseUrl()}${path}`;
};

const getGatewayHeaders = () => {
    const headers = {};
    if (process.env.GATEWAY_BEARER_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GATEWAY_BEARER_TOKEN}`;
    }
    if (process.env.GATEWAY_API_KEY) {
        headers[process.env.GATEWAY_API_KEY_HEADER || "x-api-key"] = process.env.GATEWAY_API_KEY;
    }
    return headers;
};

module.exports = { getGatewayUrl, getGatewayHeaders };
