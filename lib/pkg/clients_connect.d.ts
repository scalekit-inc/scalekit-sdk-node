import { CreateClientSecretRequest, CreateClientSecretResponse, DeleteClientSecretRequest, GetClientRequest, GetClientResponse, ListClientsRequest, ListClientsResponse, UpdateClientRequest, UpdateClientResponse, UpdateClientSecretRequest, UpdateClientSecretResponse } from "./clients_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.clients.ClientService
 */
export declare const ClientService: {
    readonly typeName: "scalekit.v1.clients.ClientService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.clients.ClientService.ListClient
         */
        readonly listClient: {
            readonly name: "ListClient";
            readonly I: typeof ListClientsRequest;
            readonly O: typeof ListClientsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.clients.ClientService.GetClient
         */
        readonly getClient: {
            readonly name: "GetClient";
            readonly I: typeof GetClientRequest;
            readonly O: typeof GetClientResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.clients.ClientService.UpdateClient
         */
        readonly updateClient: {
            readonly name: "UpdateClient";
            readonly I: typeof UpdateClientRequest;
            readonly O: typeof UpdateClientResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.clients.ClientService.CreateClientSecret
         */
        readonly createClientSecret: {
            readonly name: "CreateClientSecret";
            readonly I: typeof CreateClientSecretRequest;
            readonly O: typeof CreateClientSecretResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.clients.ClientService.UpdateClientSecret
         */
        readonly updateClientSecret: {
            readonly name: "UpdateClientSecret";
            readonly I: typeof UpdateClientSecretRequest;
            readonly O: typeof UpdateClientSecretResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.clients.ClientService.DeleteClientSecret
         */
        readonly deleteClientSecret: {
            readonly name: "DeleteClientSecret";
            readonly I: typeof DeleteClientSecretRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
    };
};
