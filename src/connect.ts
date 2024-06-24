import { ServiceType } from '@bufbuild/protobuf';
import { PromiseClient, Transport, createPromiseClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import CoreClient, { headers } from './core';

export default class GrpcConnect {
  private transport: Transport;
  constructor(
    private readonly coreClient: CoreClient
  ) {
    this.transport = createGrpcTransport({
      baseUrl: this.coreClient.envUrl,
      httpVersion: "2",
      interceptors: [
        (next) => {
          return (req) => {
            req.header.set(headers['user-agent'], this.coreClient.userAgent)
            req.header.set(headers['x-sdk-version'], this.coreClient.sdkVersion)
            req.header.set(headers['x-api-version'], this.coreClient.apiVersion)
            if (this.coreClient.accessToken) {
              req.header.set(headers.authorization, `Bearer ${this.coreClient.accessToken}`)
            }
            return next(req)
          }
        }
      ],
    });
  }

  createClient<T extends ServiceType>(service: T): PromiseClient<T> {
    return createPromiseClient(service, this.transport);
  }
}