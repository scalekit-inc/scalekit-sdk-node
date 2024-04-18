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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const connect_1 = require("@connectrpc/connect");
const axios_1 = __importStar(require("axios"));
const qs_1 = __importDefault(require("qs"));
const package_json_1 = require("../package.json");
const scalekit_1 = require("./types/scalekit");
const child_process_1 = require("child_process");
const tokenEndpoint = "oauth/token";
const jwksEndpoint = "keys";
class CoreClient {
    constructor(envUrl, clientId, clientSecret) {
        this.envUrl = envUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.keys = [];
        this.accessToken = null;
        this.uname = null;
        this.sdkVersion = `node/${package_json_1.version}`;
        this.apiVersion = "20240430";
        this.axios = axios_1.default.create({ baseURL: envUrl });
        this.axios.interceptors.request.use((config) => {
            config.headers["User-Agent"] = this.getUserAgent();
            config.headers["x-sdk-version"] = this.sdkVersion;
            config.headers["x-api-version"] = this.apiVersion;
            if (this.accessToken) {
                config.headers["Authorization"] = `Bearer ${this.accessToken}`;
            }
            return config;
        });
        this.authenticateClient();
        this.getUname();
    }
    authenticateClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.authenticate(qs_1.default.stringify({
                grant_type: scalekit_1.GrantType.ClientCredentials,
                client_id: this.clientId,
                client_secret: this.clientSecret
            }));
            this.accessToken = res.data.access_token;
        });
    }
    getUname() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uname) {
                this.uname = yield new Promise((resolve) => {
                    try {
                        (0, child_process_1.exec)('uname -a', (err, uname) => {
                            if (err) {
                                return resolve(null);
                            }
                            resolve(uname);
                        });
                    }
                    catch (e) {
                        resolve(null);
                    }
                });
            }
        });
    }
    getUserAgent() {
        return JSON.stringify({
            language: "node",
            sdkVersion: this.sdkVersion,
            uname: encodeURIComponent(this.uname || ""),
            platform: encodeURIComponent(process.platform),
            runtimeVersion: encodeURIComponent(process.version),
        });
    }
    /**
     * Authenticate with the code
     * @param {string} data Data to authenticate
     * @returns {Promise<AxiosResponse<{ access_token: string, id_token: string }>>} Returns access token and id token
     */
    authenticate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.axios.post(tokenEndpoint, data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
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
            const { data: { keys } } = yield this.axios.get(jwksEndpoint);
            this.keys = keys;
        });
    }
    /**
     *
     * @param fn Function to execute
     * @param data Data to pass to the function
     * @param retryLeft Number of retries left
     * @returns {Promise<TResponse>} Returns the response
     */
    connectExec(fn_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (fn, data, retryLeft = 1) {
            try {
                const res = yield fn(data);
                return res;
            }
            catch (error) {
                if (retryLeft > 0) {
                    let isUnauthenticatedError = false;
                    if (error instanceof axios_1.AxiosError) {
                        if (error.status == axios_1.HttpStatusCode.Unauthorized) {
                            isUnauthenticatedError = true;
                        }
                        else {
                            throw new Error(error.message);
                        }
                    }
                    // ConnectError is a custom error class that extends Error class and has a code property
                    if (error instanceof connect_1.ConnectError) {
                        if (error.code == connect_1.Code.Unauthenticated) {
                            isUnauthenticatedError = true;
                        }
                        else {
                            throw error;
                        }
                    }
                    if (isUnauthenticatedError) {
                        yield this.authenticateClient();
                        return this.connectExec(fn, data, retryLeft - 1);
                    }
                }
                throw error;
            }
        });
    }
}
exports.default = CoreClient;
//# sourceMappingURL=core.js.map