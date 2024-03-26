import { CreateEnvironmentRequest, CreateEnvironmentResponse, DeleteEnvironmentRequest, GetEnvironmentRequest, GetEnvironmentResponse, ListEnvironmentsRequest, ListEnvironmentsResponse, UpdateEnvironmentDomainRequest, UpdateEnvironmentRequest, UpdateEnvironmentResponse } from "./environments_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.environments.EnvironmentService
 */
export declare const EnvironmentService: {
    readonly typeName: "scalekit.v1.environments.EnvironmentService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.environments.EnvironmentService.CreateEnvironment
         */
        readonly createEnvironment: {
            readonly name: "CreateEnvironment";
            readonly I: typeof CreateEnvironmentRequest;
            readonly O: typeof CreateEnvironmentResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.environments.EnvironmentService.UpdateEnvironment
         */
        readonly updateEnvironment: {
            readonly name: "UpdateEnvironment";
            readonly I: typeof UpdateEnvironmentRequest;
            readonly O: typeof UpdateEnvironmentResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.environments.EnvironmentService.UpdateEnvironmentDomain
         */
        readonly updateEnvironmentDomain: {
            readonly name: "UpdateEnvironmentDomain";
            readonly I: typeof UpdateEnvironmentDomainRequest;
            readonly O: typeof UpdateEnvironmentResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.environments.EnvironmentService.GetEnvironment
         */
        readonly getEnvironment: {
            readonly name: "GetEnvironment";
            readonly I: typeof GetEnvironmentRequest;
            readonly O: typeof GetEnvironmentResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.environments.EnvironmentService.ListEnvironment
         */
        readonly listEnvironment: {
            readonly name: "ListEnvironment";
            readonly I: typeof ListEnvironmentsRequest;
            readonly O: typeof ListEnvironmentsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.environments.EnvironmentService.DeleteEnvironment
         */
        readonly deleteEnvironment: {
            readonly name: "DeleteEnvironment";
            readonly I: typeof DeleteEnvironmentRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
    };
};
