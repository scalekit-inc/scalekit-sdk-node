"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.headers = void 0;
const connect_1 = require("@connectrpc/connect");
const axios_1 = __importStar(require("axios"));
const os_1 = __importDefault(require("os"));
const qs_1 = __importDefault(require("qs"));
const scalekit_1 = require("./types/scalekit");
const base_exception_1 = require("./errors/base-exception");
exports.headers = {
    'user-agent': 'user-agent',
    'x-sdk-version': 'x-sdk-version',
    'x-api-version': 'x-api-version',
    authorization: 'authorization',
};
const tokenEndpoint = 'oauth/token';
const jwksEndpoint = 'keys';
class CoreClient {
    constructor(envUrl, clientId, clientSecret) {
        this.envUrl = envUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.keys = [];
        this.accessToken = null;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.sdkVersion = `Scalekit-Node/${require('../package.json').version}`;
        this.apiVersion = '20260310';
        this.userAgent = `${this.sdkVersion} Node/${process.version} (${process.platform}; ${os_1.default.arch()})`;
        this.axios = axios_1.default.create({ baseURL: envUrl });
        this.axios.interceptors.request.use((config) => {
            config.headers[exports.headers['user-agent']] = this.userAgent;
            config.headers[exports.headers['x-sdk-version']] = this.sdkVersion;
            config.headers[exports.headers['x-api-version']] = this.apiVersion;
            if (this.accessToken && !config.skipAuth) {
                config.headers[exports.headers.authorization] = `Bearer ${this.accessToken}`;
            }
            return config;
        });
        // removing token creation at the time of constructor and instead letting the retry functionality handle generating a token whenever required.
        //this.authenticateClient();
    }
    authenticateClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.authenticate(qs_1.default.stringify({
                grant_type: scalekit_1.GrantType.ClientCredentials,
                client_id: this.clientId,
                client_secret: this.clientSecret,
            }));
            this.accessToken = res.data.access_token;
        });
    }
    /**
     * Authenticate with the code
     * @param {string} data Data to authenticate
     * @returns {Promise<AxiosResponse<TokenResponse>>} Returns access token and id token
     */
    authenticate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.axios.post(tokenEndpoint, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                skipAuth: true,
            });
        });
    }
    /**
     * Get the JWKS from the server and store it in the client instance
     * @returns {Promise<void>} Returns nothing
     */
    getJwks() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.keys.length) {
                return Promise.resolve();
            }
            const { data: { keys }, } = yield this.axios.get(jwksEndpoint);
            this.keys = keys;
        });
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    /**
     * Execute a function with error handling and retry logic.
     *
     * @param fn Function to execute
     * @param data Data to pass to the function
     * @returns {Promise<TResponse>} Returns the response
     */
    connectExec(fn, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._connectExec(fn, data, 3, 0);
        });
    }
    _connectExec(fn, data, retryLeft, attempt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield fn(data);
            }
            catch (error) {
                // Handle gRPC Connect errors
                if (error instanceof connect_1.ConnectError) {
                    if (retryLeft > 0) {
                        if (error.code === connect_1.Code.Unauthenticated) {
                            yield this.authenticateClient();
                            return this._connectExec(fn, data, retryLeft - 1, attempt + 1);
                        }
                        // The Connect transport maps HTTP 429 to Code.Unavailable with a 429 body,
                        // and gRPC-native rate limits come as Code.ResourceExhausted.
                        const is429 = error.code === connect_1.Code.ResourceExhausted ||
                            (error.code === connect_1.Code.Unavailable && error.message.includes('429'));
                        if (is429) {
                            const baseBackoff = Math.min(1000 * Math.pow(2, attempt), 30000);
                            const backoffMs = baseBackoff * (0.5 + Math.random() * 0.5);
                            yield this.sleep(backoffMs);
                            return this._connectExec(fn, data, retryLeft - 1, attempt + 1);
                        }
                    }
                    throw base_exception_1.ScalekitServerException.promote(error);
                }
                // Handle HTTP/Axios errors
                if (error instanceof axios_1.AxiosError) {
                    if (error.response) {
                        if (retryLeft > 0) {
                            if (error.response.status === 401) {
                                yield this.authenticateClient();
                                return this._connectExec(fn, data, retryLeft - 1, attempt + 1);
                            }
                            if (error.response.status === 429) {
                                const baseBackoff = Math.min(1000 * Math.pow(2, attempt), 30000);
                                const backoffMs = baseBackoff * (0.5 + Math.random() * 0.5);
                                yield this.sleep(backoffMs);
                                return this._connectExec(fn, data, retryLeft - 1, attempt + 1);
                            }
                        }
                        throw base_exception_1.ScalekitServerException.promote(error.response);
                    }
                    else {
                        throw new base_exception_1.ScalekitException(error);
                    }
                }
                // Handle existing ScalekitException instances
                if (error instanceof base_exception_1.ScalekitException) {
                    throw error;
                }
                // Handle generic errors
                throw new base_exception_1.ScalekitException(error);
            }
        });
    }
}
exports.default = CoreClient;
//# sourceMappingURL=core.js.map