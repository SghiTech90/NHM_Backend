const DEFAULT_ORIGINS = [
    'https://nhm.wispune.com',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];

export function getAllowedOrigins() {
    const fromList = process.env.ALLOWED_ORIGINS
        ?.split(',')
        .map((value) => value.trim())
        .filter(Boolean);

    if (fromList?.length) {
        return fromList;
    }

    if (process.env.CLIENT_URL?.trim()) {
        return [process.env.CLIENT_URL.trim()];
    }

    return DEFAULT_ORIGINS;
}

export function corsOriginCallback(origin, callback) {
    const allowed = getAllowedOrigins();

    // Server-to-server, health checks, and same-origin tools often omit Origin.
    if (!origin || allowed.includes(origin)) {
        callback(null, true);
        return;
    }

    callback(null, false);
}
