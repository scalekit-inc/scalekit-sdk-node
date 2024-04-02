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
const scalekit_1 = require("./types/scalekit");
const tokenEndpoint = "oauth/token";
const jwksEndpoint = "keys";
class CoreClient {
    constructor(envUrl, clientId, clientSecret) {
        this.envUrl = envUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.keys = [];
        this.accessToken = null;
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
    authenticate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.post(`${this.envUrl}/${tokenEndpoint}`, data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        });
    }
    getJwks() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.keys.length) {
                const { data: { keys } } = yield axios_1.default.get(`${this.envUrl}/${jwksEndpoint}`);
                this.keys = keys;
            }
        });
    }
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