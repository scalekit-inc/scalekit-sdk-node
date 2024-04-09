import { ServiceType } from '@bufbuild/protobuf';
import { PromiseClient, Transport, createPromiseClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { version } from "../package.json";
import CoreClient from './core';

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
            req.header.set("User-Agent", `scalekit-node/${version}`)
            if (this.coreClient.accessToken) {
              req.header.set("Authorization", `Bearer ${this.coreClient.accessToken}`)
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