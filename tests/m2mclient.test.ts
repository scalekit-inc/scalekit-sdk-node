import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { TestOrganizationManager } from './utils/test-data';

describe('M2M Client (OrganizationClients)', () => {
  let client: ScalekitClient;
  let testOrg: string;

  beforeAll(async () => {
    const envUrl = process.env.SCALEKIT_ENVIRONMENT_URL;
    const clientId = process.env.SCALEKIT_CLIENT_ID;
    const clientSecret = process.env.SCALEKIT_CLIENT_SECRET;
    if (!envUrl || !clientId || !clientSecret) {
      throw new Error(
        'SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, SCALEKIT_CLIENT_SECRET are required'
      );
    }
    client = global.client;
    testOrg = await TestOrganizationManager.createTestOrganization(client);
  });

  afterAll(async () => {
    await TestOrganizationManager.cleanupTestOrganization(client, testOrg);
  });

  describe('createOrganizationClient', () => {
    it('should create an M2M client with a name', async () => {
      let createdClientId: string | undefined;
      try {
        const response = await client.m2m.createOrganizationClient(testOrg, {
          name: 'Test M2M Client',
          description: 'Integration test client',
        });
        createdClientId = response.client?.clientId;

        expect(response.client).toBeDefined();
        expect(response.client?.clientId).toBeTruthy();
        expect(response.client?.name).toBe('Test M2M Client');
      } finally {
        if (createdClientId) {
          await client.m2m
            .deleteOrganizationClient(testOrg, createdClientId)
            .catch(() => {});
        }
      }
    });

    it('should throw when organizationId is empty', async () => {
      await expect(client.m2m.createOrganizationClient('', {})).rejects.toThrow(
        'organizationId is required'
      );
    });
  });

  describe('getOrganizationClient', () => {
    it('should retrieve a created M2M client by id', async () => {
      const created = await client.m2m.createOrganizationClient(testOrg, {
        name: 'Get Test Client',
      });
      if (!created.client) throw new Error('Expected client in response');
      const clientId = created.client.clientId;
      try {
        const fetched = await client.m2m.getOrganizationClient(
          testOrg,
          clientId
        );
        expect(fetched.client?.clientId).toBe(clientId);
        expect(fetched.client?.name).toBe('Get Test Client');
      } finally {
        await client.m2m
          .deleteOrganizationClient(testOrg, clientId)
          .catch(() => {});
      }
    });

    it('should throw when clientId is empty', async () => {
      await expect(
        client.m2m.getOrganizationClient(testOrg, '')
      ).rejects.toThrow('clientId is required');
    });
  });

  describe('updateOrganizationClient', () => {
    it('should update the name and description of an M2M client', async () => {
      const created = await client.m2m.createOrganizationClient(testOrg, {
        name: 'Original Name',
      });
      if (!created.client) throw new Error('Expected client in response');
      const clientId = created.client.clientId;
      try {
        const updated = await client.m2m.updateOrganizationClient(
          testOrg,
          clientId,
          {
            name: 'Updated Name',
            description: 'Updated description',
          }
        );
        expect(updated.client?.name).toBe('Updated Name');
        expect(updated.client?.description).toBe('Updated description');
      } finally {
        await client.m2m
          .deleteOrganizationClient(testOrg, clientId)
          .catch(() => {});
      }
    });
  });

  describe('createOrganizationClientSecret', () => {
    it('should create a new secret and return the plain value once', async () => {
      const created = await client.m2m.createOrganizationClient(testOrg, {
        name: 'Secret Test Client',
      });
      if (!created.client) throw new Error('Expected client in response');
      const clientId = created.client.clientId;
      try {
        const secretResp = await client.m2m.createOrganizationClientSecret(
          testOrg,
          clientId
        );
        const secretId = secretResp.secret?.secretId;
        expect(secretId).toBeTruthy();
        expect(secretResp.plainSecret).toBeTruthy();

        // Cleanup secret
        await client.m2m
          .deleteOrganizationClientSecret(testOrg, clientId, secretId as string)
          .catch(() => {});
      } finally {
        await client.m2m
          .deleteOrganizationClient(testOrg, clientId)
          .catch(() => {});
      }
    });

    it('should throw when clientId is empty', async () => {
      await expect(
        client.m2m.createOrganizationClientSecret(testOrg, '')
      ).rejects.toThrow('clientId is required');
    });
  });

  describe('deleteOrganizationClientSecret', () => {
    it('should delete a secret from an M2M client', async () => {
      const created = await client.m2m.createOrganizationClient(testOrg, {
        name: 'Delete Secret Client',
      });
      if (!created.client) throw new Error('Expected client in response');
      const clientId = created.client.clientId;
      try {
        const secretResp = await client.m2m.createOrganizationClientSecret(
          testOrg,
          clientId
        );
        const secretId = secretResp.secret?.secretId;
        expect(secretId).toBeTruthy();
        expect(secretResp.plainSecret).toBeTruthy();

        await expect(
          client.m2m.deleteOrganizationClientSecret(
            testOrg,
            clientId,
            secretId as string
          )
        ).resolves.not.toThrow();
      } finally {
        await client.m2m
          .deleteOrganizationClient(testOrg, clientId)
          .catch(() => {});
      }
    });

    it('should throw when secretId is empty', async () => {
      await expect(
        client.m2m.deleteOrganizationClientSecret(testOrg, 'skc_dummy', '')
      ).rejects.toThrow('secretId is required');
    });
  });

  describe('listOrganizationClients', () => {
    it('should list clients for an organization', async () => {
      const created = await client.m2m.createOrganizationClient(testOrg, {
        name: 'List Test Client',
      });
      if (!created.client) throw new Error('Expected client in response');
      const clientId = created.client.clientId;
      try {
        const list = await client.m2m.listOrganizationClients(testOrg, {
          pageSize: 10,
        });
        expect(list.clients).toBeDefined();
        expect(list.clients.length).toBeGreaterThan(0);
        const found = list.clients.some((c) => c.clientId === clientId);
        expect(found).toBe(true);
      } finally {
        await client.m2m
          .deleteOrganizationClient(testOrg, clientId)
          .catch(() => {});
      }
    });

    it('should throw when organizationId is empty', async () => {
      await expect(client.m2m.listOrganizationClients('')).rejects.toThrow(
        'organizationId is required'
      );
    });
  });

  describe('deleteOrganizationClient', () => {
    it('should delete an M2M client', async () => {
      const created = await client.m2m.createOrganizationClient(testOrg, {
        name: 'To Delete Client',
      });
      if (!created.client) throw new Error('Expected client in response');
      const clientId = created.client.clientId;

      await expect(
        client.m2m.deleteOrganizationClient(testOrg, clientId)
      ).resolves.not.toThrow();
    });

    it('should throw when clientId is empty', async () => {
      await expect(
        client.m2m.deleteOrganizationClient(testOrg, '')
      ).rejects.toThrow('clientId is required');
    });
  });
});
