import { ServiceType } from '@bufbuild/protobuf';
import { PromiseClient } from '@connectrpc/connect';
import CoreClient from './core';
export default class GrpcConnect {
    private readonly envUrl;
    private readonly coreClient;
    private transport;
    constructor(envUrl: string, coreClient: CoreClient);
    createClient<T extends ServiceType>(service: T): PromiseClient<T>;
}
