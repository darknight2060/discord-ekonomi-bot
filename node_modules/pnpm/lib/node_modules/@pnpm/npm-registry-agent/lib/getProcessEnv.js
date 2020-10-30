"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getProcessEnv(env) {
    if (!env) {
        return;
    }
    let value;
    if (Array.isArray(env)) {
        for (let e of env) {
            value = process.env[e] ||
                process.env[e.toUpperCase()] ||
                process.env[e.toLowerCase()];
            if (typeof value !== 'undefined') {
                break;
            }
        }
    }
    if (typeof env === 'string') {
        value = process.env[env] ||
            process.env[env.toUpperCase()] ||
            process.env[env.toLowerCase()];
    }
    return value;
}
exports.default = getProcessEnv;
