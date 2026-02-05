import type { DescService } from '@bufbuild/protobuf';
import { type Client } from '@connectrpc/connect';
import CoreClient from './core';
export default class GrpcConnect {
    private readonly coreClient;
    private transport;
    constructor(coreClient: CoreClient);
    createClient<T extends DescService>(service: T): Client<T>;
}
