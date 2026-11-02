"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJwt = exports.jwtVerify = exports.createLocalJWKSet = void 0;
const ES_MODULE_AS_COMMONJS = /Cannot use import statement outside a module|Unexpected token 'export'/;
function cannotRequireEsModule(error) {
    const e = error;
    if (typeof e !== 'object' || e === null)
        return false;
    if (e.code === 'ERR_REQUIRE_ESM')
        return true;
    return (e.name === 'SyntaxError' && ES_MODULE_AS_COMMONJS.test(String(e.message)));
}
let jose;
try {
    jose = require('jose');
}
catch (error) {
    if (!cannotRequireEsModule(error)) {
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