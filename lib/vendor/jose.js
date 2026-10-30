"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJwt = exports.jwtVerify = exports.createLocalJWKSet = void 0;
let jose;
try {
    jose = require('jose');
}
catch (error) {
    if ((error === null || error === void 0 ? void 0 : error.code) !== 'ERR_REQUIRE_ESM') {
        throw error;
    }
    try {
        jose = require('./jose.bundle');
    }
    catch (bundleError) {
        // Report the original failure; a missing bundle is secondary to it.
        error.cause = bundleError;
        throw error;
    }
}
exports.createLocalJWKSet = jose.createLocalJWKSet, exports.jwtVerify = jose.jwtVerify, exports.decodeJwt = jose.decodeJwt;
//# sourceMappingURL=jose.js.map