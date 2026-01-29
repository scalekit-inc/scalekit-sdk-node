import { CreateConnectedAccountRequest, CreateConnectedAccountResponse, DeleteConnectedAccountRequest, DeleteConnectedAccountResponse, GetConnectedAccountByIdentifierRequest, GetConnectedAccountByIdentifierResponse, GetMagicLinkForConnectedAccountRequest, GetMagicLinkForConnectedAccountResponse, ListConnectedAccountsRequest, ListConnectedAccountsResponse, SearchConnectedAccountsRequest, SearchConnectedAccountsResponse, UpdateConnectedAccountRequest, UpdateConnectedAccountResponse } from "./connected_accounts_pb.js";
import { MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.connected_accounts.ConnectedAccountService
 */
export declare const ConnectedAccountService: {
    readonly typeName: "scalekit.v1.connected_accounts.ConnectedAccountService";
    readonly methods: {
        /**
         * List Connected Accounts
         *
         * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.ListConnectedAccounts
         */
        readonly listConnectedAccounts: {
            readonly name: "ListConnectedAccounts";
            readonly I: typeof ListConnectedAccountsRequest;
            readonly O: typeof ListConnectedAccountsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Search Connected Accounts
         *
         * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.SearchConnectedAccounts
         */
        readonly searchConnectedAccounts: {
            readonly name: "SearchConnectedAccounts";
            readonly I: typeof SearchConnectedAccountsRequest;
            readonly O: typeof SearchConnectedAccountsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Create Connected Account
         *
         * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.CreateConnectedAccount
         */
        readonly createConnectedAccount: {
            readonly name: "CreateConnectedAccount";
            readonly I: typeof CreateConnectedAccountRequest;
            readonly O: typeof CreateConnectedAccountResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Update Connected Account
         *
         * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.UpdateConnectedAccount
         */
        readonly updateConnectedAccount: {
            readonly name: "UpdateConnectedAccount";
            readonly I: typeof UpdateConnectedAccountRequest;
            readonly O: typeof UpdateConnectedAccountResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Delete Connected Account
         *
         * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.DeleteConnectedAccount
         */
        readonly deleteConnectedAccount: {
            readonly name: "DeleteConnectedAccount";
            readonly I: typeof DeleteConnectedAccountRequest;
            readonly O: typeof DeleteConnectedAccountResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Generate Magic Link for Account Connection
         *
         * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.GetMagicLinkForConnectedAccount
         */
        readonly getMagicLinkForConnectedAccount: {
            readonly name: "GetMagicLinkForConnectedAccount";
            readonly I: typeof GetMagicLinkForConnectedAccountRequest;
            readonly O: typeof GetMagicLinkForConnectedAccountResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Get Connected Account Authentication Details
         *
         * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.GetConnectedAccountAuth
         */
        readonly getConnectedAccountAuth: {
            readonly name: "GetConnectedAccountAuth";
            readonly I: typeof GetConnectedAccountByIdentifierRequest;
            readonly O: typeof GetConnectedAccountByIdentifierResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
