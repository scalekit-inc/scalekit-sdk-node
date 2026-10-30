"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJwt = exports.jwtVerify = exports.createLocalJWKSet = void 0;
function isRequireEsmError(error) {
    return (typeof error === 'object' &&
        error !== null &&
        error.code === 'ERR_REQUIRE_ESM');
}
function loadJose() {
    try {
        return require('jose');
    }
    catch (error) {
        if (isRequireEsmError(error)) {
            return require('./jose.bundle');
        }
        throw error;
    }
}
const jose = loadJose();
exports.createLocalJWKSet = jose.createLocalJWKSet;
exports.jwtVerify = jose.jwtVerify;
exports.decodeJwt = jose.decodeJwt;
//# sourceMappingURL=jose.js.map