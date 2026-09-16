import ScalekitClient from '../src/scalekit';
import { ResourceType } from '../src/resource';
import { describe, it, expect, beforeAll } from '@jest/globals';

// A real MCP server resource in the test environment. It currently has no
// consents, which is fine — these tests assert the call shape and pagination
// envelope, never the consent contents.
const TEST_RESOURCE_ID = 'res_142145647087190278';

// Syntactically valid but nonexistent resource id, used to assert that
// deleteResourceClient refuses to touch a client under the wrong resource
// scope instead of trusting the id pair blindly.
const OTHER_RESOURCE_ID = 'res_999999999999999999';

describe('Resource Client (UserConsents)', () => {
  let client: ScalekitClient;

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
  });

  describe('listUserConsents', () => {
    it('should list consents for a resource', async () => {
      const response =
        await client.resources.listUserConsents(TEST_RESOURCE_ID);

      expect(response).toBeDefined();
      expect(Array.isArray(response.consents)).toBe(true);
      expect(typeof response.totalSize).toBe('number');
    });

    it('should accept a page size', async () => {
      const response = await client.resources.listUserConsents(
        TEST_RESOURCE_ID,
        { pageSize: 10 }
      );

      expect(response).toBeDefined();
      expect(Array.isArray(response.consents)).toBe(true);
      expect(response.consents.length).toBeLessThanOrEqual(10);
    });

    it('should accept a search term', async () => {
      const response = await client.resources.listUserConsents(
        TEST_RESOURCE_ID,
        { search: 'usr_' }
      );

      expect(response).toBeDefined();
      expect(Array.isArray(response.consents)).toBe(true);
    });

    it('should accept an exact userIds filter', async () => {
      const response = await client.resources.listUserConsents(
        TEST_RESOURCE_ID,
        { userIds: ['usr_does_not_exist'] }
      );

      expect(response).toBeDefined();
      expect(Array.isArray(response.consents)).toBe(true);
    });

    it('should accept userIds together with search', async () => {
      // userIds takes precedence server-side; search is ignored.
      const response = await client.resources.listUserConsents(
        TEST_RESOURCE_ID,
        { userIds: ['usr_does_not_exist'], search: 'usr_' }
      );

      expect(response).toBeDefined();
      expect(Array.isArray(response.consents)).toBe(true);
    });

    it('should throw when resourceId is empty', async () => {
      await expect(client.resources.listUserConsents('')).rejects.toThrow(
        'resourceId is required'
      );
    });
  });

  describe('revokeUserConsent', () => {
    it('should throw when clientId is empty', async () => {
      await expect(
        client.resources.revokeUserConsent('', 'usrcnst_1234567890')
      ).rejects.toThrow('clientId is required');
    });

    it('should throw when consentId is empty', async () => {
      await expect(
        client.resources.revokeUserConsent('m2m_1234567890', '')
      ).rejects.toThrow('consentId is required');
    });
  });
});

describe('Resource Client (Resources)', () => {
  let client: ScalekitClient;

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
  });

  describe('getResource', () => {
    it('should fetch a resource by id, including its allowed scopes', async () => {
      const response = await client.resources.getResource(TEST_RESOURCE_ID);

      expect(response.resource).toBeDefined();
      expect(response.resource?.id).toBe(TEST_RESOURCE_ID);
      expect(Array.isArray(response.resource?.scopes)).toBe(true);
    });

    it('should throw when resourceId is empty', async () => {
      await expect(client.resources.getResource('')).rejects.toThrow(
        'resourceId is required'
      );
    });

    it('should throw for a nonexistent resource', async () => {
      await expect(
        client.resources.getResource(OTHER_RESOURCE_ID)
      ).rejects.toThrow();
    });
  });

  describe('listResources', () => {
    it('should list resources of a given type in the environment', async () => {
      const response = await client.resources.listResources(
        ResourceType.MCP_SERVER
      );

      expect(response).toBeDefined();
      expect(Array.isArray(response.resources)).toBe(true);
      expect(response.resources.some((r) => r.id === TEST_RESOURCE_ID)).toBe(
        true
      );
    });

    it('should accept a page size', async () => {
      const response = await client.resources.listResources(
        ResourceType.MCP_SERVER,
        { pageSize: 1 }
      );

      expect(response).toBeDefined();
      expect(response.resources.length).toBeLessThanOrEqual(1);
    });
  });
});

describe('Resource Client (ResourceClients)', () => {
  let client: ScalekitClient;

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
  });

  describe('createResourceClient', () => {
    it('should create an API client scoped to a resource', async () => {
      let createdClientId: string | undefined;
      try {
        const response = await client.resources.createResourceClient(
          TEST_RESOURCE_ID,
          {
            name: 'Test Resource Client',
            description: 'Integration test client',
          }
        );
        createdClientId = response.client?.clientId;

        expect(response.client).toBeDefined();
        expect(response.client?.clientId).toBeTruthy();
        expect(response.client?.name).toBe('Test Resource Client');
        expect(response.client?.resourceId).toBe(TEST_RESOURCE_ID);
        expect(response.plainSecret).toBeTruthy();
      } finally {
        if (createdClientId) {
          await client.resources.deleteResourceClient(
            TEST_RESOURCE_ID,
            createdClientId
          );
        }
      }
    });

    it('should throw when resourceId is empty', async () => {
      await expect(client.resources.createResourceClient('')).rejects.toThrow(
        'resourceId is required'
      );
    });
  });

  describe('getResourceClient', () => {
    it('should retrieve a created resource client by id', async () => {
      const created = await client.resources.createResourceClient(
        TEST_RESOURCE_ID,
        { name: 'Get Test Client' }
      );
      if (!created.client?.clientId)
        throw new Error('Expected created client with clientId');
      const clientId = created.client.clientId;
      try {
        const fetched = await client.resources.getResourceClient(
          TEST_RESOURCE_ID,
          clientId
        );
        expect(fetched.client?.clientId).toBe(clientId);
        expect(fetched.client?.name).toBe('Get Test Client');
        expect(Array.isArray(fetched.consentedUsers)).toBe(true);
      } finally {
        await client.resources.deleteResourceClient(TEST_RESOURCE_ID, clientId);
      }
    });

    it('should throw when resourceId is empty', async () => {
      await expect(
        client.resources.getResourceClient('', 'm2m_1234567890')
      ).rejects.toThrow('resourceId is required');
    });

    it('should throw when clientId is empty', async () => {
      await expect(
        client.resources.getResourceClient(TEST_RESOURCE_ID, '')
      ).rejects.toThrow('clientId is required');
    });
  });

  describe('listResourceClients', () => {
    it('should list clients for a resource', async () => {
      const created = await client.resources.createResourceClient(
        TEST_RESOURCE_ID,
        { name: 'List Test Client' }
      );
      if (!created.client?.clientId)
        throw new Error('Expected created client with clientId');
      const clientId = created.client.clientId;
      try {
        const list =
          await client.resources.listResourceClients(TEST_RESOURCE_ID);
        expect(list.clients).toBeDefined();
        expect(typeof list.totalDcrClients).toBe('number');
        expect(typeof list.totalStaticClients).toBe('number');
        const found = list.clients.some((c) => c.clientId === clientId);
        expect(found).toBe(true);
      } finally {
        await client.resources.deleteResourceClient(TEST_RESOURCE_ID, clientId);
      }
    });

    it('should throw when resourceId is empty', async () => {
      await expect(client.resources.listResourceClients('')).rejects.toThrow(
        'resourceId is required'
      );
    });
  });

  describe('updateResourceClient', () => {
    it('should update the name and description of a resource client', async () => {
      const created = await client.resources.createResourceClient(
        TEST_RESOURCE_ID,
        { name: 'Original Name' }
      );
      if (!created.client?.clientId)
        throw new Error('Expected created client with clientId');
      const clientId = created.client.clientId;
      try {
        const updated = await client.resources.updateResourceClient(
          TEST_RESOURCE_ID,
          clientId,
          { name: 'Updated Name', description: 'Updated description' }
        );
        expect(updated.client?.name).toBe('Updated Name');
        expect(updated.client?.description).toBe('Updated description');
      } finally {
        await client.resources.deleteResourceClient(TEST_RESOURCE_ID, clientId);
      }
    });

    it('should update scopes via the update mask', async () => {
      const created = await client.resources.createResourceClient(
        TEST_RESOURCE_ID,
        { name: 'Scopes Test Client', scopes: ['read'] }
      );
      if (!created.client?.clientId)
        throw new Error('Expected created client with clientId');
      const clientId = created.client.clientId;
      try {
        const updated = await client.resources.updateResourceClient(
          TEST_RESOURCE_ID,
          clientId,
          { scopes: ['read', 'write'] }
        );
        expect(updated.client?.scopes).toEqual(['read', 'write']);
      } finally {
        await client.resources.deleteResourceClient(TEST_RESOURCE_ID, clientId);
      }
    });

    it('should throw when resourceId is empty', async () => {
      await expect(
        client.resources.updateResourceClient('', 'm2m_1234567890')
      ).rejects.toThrow('resourceId is required');
    });

    it('should throw when clientId is empty', async () => {
      await expect(
        client.resources.updateResourceClient(TEST_RESOURCE_ID, '')
      ).rejects.toThrow('clientId is required');
    });
  });

  describe('createResourceClientSecret / deleteResourceClientSecret', () => {
    it('should create and delete a secret for a resource client', async () => {
      const created = await client.resources.createResourceClient(
        TEST_RESOURCE_ID,
        { name: 'Secret Test Client' }
      );
      if (!created.client?.clientId)
        throw new Error('Expected created client with clientId');
      const clientId = created.client.clientId;
      try {
        const newSecret = await client.resources.createResourceClientSecret(
          TEST_RESOURCE_ID,
          clientId
        );
        expect(newSecret.plainSecret).toBeTruthy();
        expect(newSecret.secret?.id).toBeTruthy();

        await expect(
          client.resources.deleteResourceClientSecret(
            TEST_RESOURCE_ID,
            clientId,
            newSecret.secret!.id
          )
        ).resolves.not.toThrow();
      } finally {
        await client.resources.deleteResourceClient(TEST_RESOURCE_ID, clientId);
      }
    });

    it('should refuse to create a secret for a client that does not belong to the given resource', async () => {
      const created = await client.resources.createResourceClient(
        TEST_RESOURCE_ID,
        { name: 'Scoped Secret Client' }
      );
      if (!created.client?.clientId)
        throw new Error('Expected created client with clientId');
      const clientId = created.client.clientId;
      try {
        await expect(
          client.resources.createResourceClientSecret(
            OTHER_RESOURCE_ID,
            clientId
          )
        ).rejects.toThrow();
      } finally {
        await client.resources.deleteResourceClient(TEST_RESOURCE_ID, clientId);
      }
    });

    it('should throw when resourceId is empty', async () => {
      await expect(
        client.resources.createResourceClientSecret('', 'm2m_1234567890')
      ).rejects.toThrow('resourceId is required');
      await expect(
        client.resources.deleteResourceClientSecret(
          '',
          'm2m_1234567890',
          'sks_1234567890'
        )
      ).rejects.toThrow('resourceId is required');
    });

    it('should throw when clientId is empty', async () => {
      await expect(
        client.resources.createResourceClientSecret(TEST_RESOURCE_ID, '')
      ).rejects.toThrow('clientId is required');
      await expect(
        client.resources.deleteResourceClientSecret(
          TEST_RESOURCE_ID,
          '',
          'sks_1234567890'
        )
      ).rejects.toThrow('clientId is required');
    });

    it('should throw when secretId is empty', async () => {
      const created = await client.resources.createResourceClient(
        TEST_RESOURCE_ID,
        { name: 'Secret Id Required Client' }
      );
      if (!created.client?.clientId)
        throw new Error('Expected created client with clientId');
      const clientId = created.client.clientId;
      try {
        await expect(
          client.resources.deleteResourceClientSecret(
            TEST_RESOURCE_ID,
            clientId,
            ''
          )
        ).rejects.toThrow('secretId is required');
      } finally {
        await client.resources.deleteResourceClient(TEST_RESOURCE_ID, clientId);
      }
    });
  });

  describe('deleteResourceClient', () => {
    it('should delete a resource client', async () => {
      const created = await client.resources.createResourceClient(
        TEST_RESOURCE_ID,
        { name: 'To Delete Client' }
      );
      if (!created.client?.clientId)
        throw new Error('Expected created client with clientId');
      const clientId = created.client.clientId;

      await expect(
        client.resources.deleteResourceClient(TEST_RESOURCE_ID, clientId)
      ).resolves.not.toThrow();
    });

    it('should throw when resourceId is empty', async () => {
      await expect(
        client.resources.deleteResourceClient('', 'm2m_1234567890')
      ).rejects.toThrow('resourceId is required');
    });

    it('should throw when clientId is empty', async () => {
      await expect(
        client.resources.deleteResourceClient(TEST_RESOURCE_ID, '')
      ).rejects.toThrow('clientId is required');
    });

    it('should refuse to delete a client that does not belong to the given resource', async () => {
      const created = await client.resources.createResourceClient(
        TEST_RESOURCE_ID,
        { name: 'Scoped Delete Client' }
      );
      if (!created.client?.clientId)
        throw new Error('Expected created client with clientId');
      const clientId = created.client.clientId;
      try {
        // OTHER_RESOURCE_ID doesn't exist, so the client can't belong to it —
        // the SDK-side ownership check (or the server's own 404) must refuse
        // the delete rather than removing the client anyway.
        await expect(
          client.resources.deleteResourceClient(OTHER_RESOURCE_ID, clientId)
        ).rejects.toThrow();

        // The client must still exist under its real resource.
        const stillThere = await client.resources.getResourceClient(
          TEST_RESOURCE_ID,
          clientId
        );
        expect(stillThere.client?.clientId).toBe(clientId);
      } finally {
        await client.resources.deleteResourceClient(TEST_RESOURCE_ID, clientId);
      }
    });
  });
});
