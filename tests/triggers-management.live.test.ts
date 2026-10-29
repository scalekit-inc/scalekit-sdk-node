/**
 * Live tests for scalekit.actions.triggers against a real environment. The
 * whole file is skipped unless SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID
 * and SCALEKIT_CLIENT_SECRET hold real values (placeholders such as "dummy"
 * or an `.invalid` host count as unset). Every case first checks, once,
 * that triggers are available for the environment, and skips at run time
 * (with a warning) where they are not. getActivity, getUsage and the
 * not-found cases need nothing else; the other cases also skip unless their fixture is set:
 *
 *   SCALEKIT_TEST_TRIGGER_CONNECTION_ID       a connection whose provider
 *                                             publishes webhook triggers and
 *                                             signs its own events: none of
 *                                             its triggers in listAvailable
 *                                             reports providesBearerSecret
 *   SCALEKIT_TEST_TRIGGER_POLL_CONNECTION_ID  a connection with a polled trigger
 *   SCALEKIT_TEST_TRIGGER_POLL_ACCOUNT_ID     an eligible connected account on
 *                                             it with no subscription to the
 *                                             polled trigger of its own
 *   SCALEKIT_TEST_TRIGGER_POLL_TRIGGER        the polled trigger's name
 *   SCALEKIT_TEST_TRIGGER_POLL_CONFIG         its config as JSON (optional, "{}")
 *   SCALEKIT_TEST_TRIGGER_ENDPOINT_ID         a trigger delivery endpoint
 *
 * Subscriptions created here are deleted by the tests, and again in
 * afterAll in case an assertion failed first. Creating the connection's
 * webhook URL is idempotent and is left in place. Two cases check the
 * fixture first and skip at run time (with a warning naming the reason)
 * rather than touch data they did not create:
 * - generateSigningSecret runs only when no trigger on the connection
 *   reports providesBearerSecret, the condition under which the server
 *   refuses it without writing anything.
 * - The subscription cases run only when the fixture account has no
 *   subscription to the polled trigger yet: batchDeleteSubscriptions by
 *   trigger and account deletes every one it has.
 *
 * Not exercised live, on purpose (each is covered by the unit tests in
 * triggers-management.test.ts):
 * - batchResendDeliveries and recoverDeliveries send real deliveries to the
 *   fixture endpoint.
 * - setSigningSecret and confirmSigningSecretRotation change the signing
 *   secret of the shared fixture connection, which would break event
 *   verification for anything else using it.
 */
import { afterAll, describe, expect, it } from '@jest/globals';
import ScalekitClient from '../src/scalekit';
import {
  ScalekitBadRequestException,
  ScalekitConflictException,
  ScalekitNotFoundException,
  type TriggerSubscription,
} from '../src';

const PLACEHOLDER = /^(|dummy|unset|test|placeholder|changeme|x+)$/i;

function isReal(value: string | undefined): value is string {
  return value !== undefined && !PLACEHOLDER.test(value.trim());
}

function isRealUrl(value: string | undefined): boolean {
  if (!isReal(value)) return false;
  try {
    const host = new URL(value).hostname;
    return !/(^|\.)(invalid|example)$/i.test(host) && !/dummy/i.test(host);
  } catch {
    return false;
  }
}

const env = process.env;
const enabled =
  isRealUrl(env.SCALEKIT_ENVIRONMENT_URL) &&
  isReal(env.SCALEKIT_CLIENT_ID) &&
  isReal(env.SCALEKIT_CLIENT_SECRET);

const connectionId = env.SCALEKIT_TEST_TRIGGER_CONNECTION_ID;
const pollConnectionId = env.SCALEKIT_TEST_TRIGGER_POLL_CONNECTION_ID;
const pollAccountId = env.SCALEKIT_TEST_TRIGGER_POLL_ACCOUNT_ID;
const pollTrigger = env.SCALEKIT_TEST_TRIGGER_POLL_TRIGGER;
const endpointId = env.SCALEKIT_TEST_TRIGGER_ENDPOINT_ID;
const hasPoll = Boolean(pollConnectionId && pollAccountId && pollTrigger);

function pollConfig(): Record<string, string> {
  const raw = env.SCALEKIT_TEST_TRIGGER_POLL_CONFIG;
  if (!raw) return {};
  const parsed: unknown = JSON.parse(raw);
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('SCALEKIT_TEST_TRIGGER_POLL_CONFIG must be a JSON object');
  }
  return Object.fromEntries(
    Object.entries(parsed as Record<string, unknown>).map(([k, v]) => [
      k,
      String(v),
    ])
  );
}

// Its own client, so this file doesn't depend on the shared setup. The
// constructor makes no requests, so placeholders are harmless when skipped.
const client = new ScalekitClient(
  env.SCALEKIT_ENVIRONMENT_URL || 'https://unset.invalid',
  env.SCALEKIT_CLIENT_ID || 'unset',
  env.SCALEKIT_CLIENT_SECRET || 'unset'
);
const triggers = client.actions.triggers;

// IDs that are well formed but name nothing.
const MISSING_CONNECTION = 'conn_1';
const MISSING_ACCOUNT = 'ca_1';
const MISSING_DELIVERY = 'msg_sdknodelivetestmissing0000';

const created = new Map<string, string>(); // subscription ID → connection ID

function track(sub: TriggerSubscription | undefined): void {
  if (sub) created.set(sub.id, sub.connectionId);
}

/** Every subscription to `triggerName` on the connection, across all pages. */
async function allSubscriptions(
  connectionId: string,
  triggerName: string
): Promise<TriggerSubscription[]> {
  const all: TriggerSubscription[] = [];
  let pageToken: string | undefined;
  do {
    const page = await triggers.listSubscriptions(connectionId, {
      triggerName,
      pageSize: 100,
      pageToken,
    });
    all.push(...page.subscriptions);
    pageToken = page.nextPageToken;
  } while (pageToken);
  return all;
}

/** The fixture account's subscriptions to the fixture trigger, other than those this run created. */
async function foreignFixtureSubscriptions(): Promise<TriggerSubscription[]> {
  const subs = await allSubscriptions(
    pollConnectionId as string,
    pollTrigger as string
  );
  return subs.filter(
    (s) => s.connectedAccountId === pollAccountId && !created.has(s.id)
  );
}

/** Ends a case early when the fixture is not safe to use, saying why. */
function skipAtRunTime(reason: string): void {
  console.warn(`skipped: ${reason}`);
}

let availability: Promise<boolean> | undefined;

/**
 * Whether triggers are available for this environment, asked once. An
 * environment without them answers every trigger call with 404
 * RESOURCE_NOT_FOUND, and getActivity takes no IDs, so that answer from it
 * can only mean triggers are not available. Any other error fails the case.
 */
function triggersAvailable(): Promise<boolean> {
  availability ??= triggers.getActivity().then(
    () => true,
    (error: unknown) => {
      if (
        error instanceof ScalekitNotFoundException &&
        error.errorCode === 'RESOURCE_NOT_FOUND'
      ) {
        return false;
      }
      throw error;
    }
  );
  return availability;
}

/** A live case that runs only where triggers are available for the environment. */
function liveIt(name: string, fn: () => Promise<void>): void {
  it(name, async () => {
    if (!(await triggersAvailable())) {
      skipAtRunTime('triggers are not available for this environment');
      return;
    }
    await fn();
  });
}

const withConnection = connectionId ? liveIt : it.skip;
const withPoll = hasPoll ? liveIt : it.skip;
const withEndpoint = endpointId ? liveIt : it.skip;

(enabled ? describe : describe.skip)('actions.triggers (live)', () => {
  afterAll(async () => {
    for (const [id, conn] of created) {
      await triggers.deleteSubscription(conn, id).catch(() => undefined);
    }
  });

  liveIt('an unknown connection is not found', async () => {
    await expect(
      triggers.listAvailable(MISSING_CONNECTION)
    ).rejects.toBeInstanceOf(ScalekitNotFoundException);
  });

  withConnection('listAvailable returns the catalogue', async () => {
    const catalog = await triggers.listAvailable(connectionId as string);
    expect(Array.isArray(catalog.triggers)).toBe(true);
    expect(typeof catalog.connectionUsesSharedApp).toBe('boolean');
    for (const t of catalog.triggers) {
      expect(typeof t.name).toBe('string');
    }
  });

  liveIt(
    'getUsage for 24h returns hourly usage, or reports usage as not metered',
    async () => {
      let usage;
      try {
        usage = await triggers.getUsage({ period: '24h' });
      } catch (error) {
        expect(error).toBeInstanceOf(ScalekitNotFoundException);
        expect((error as ScalekitNotFoundException).errorCode).toBe(
          'TRIGGER_USAGE_NOT_METERED'
        );
        return;
      }
      expect(usage.period).toBe('24h');
      expect(usage.bucket).toBe('HOUR');
      expect(usage.days).toEqual([]);
      expect(usage.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(usage.currentHour).toBeInstanceOf(Date);
      for (const h of usage.hours) {
        expect(h.start).toBeInstanceOf(Date);
        expect(Number.isSafeInteger(h.units)).toBe(true);
      }
    }
  );

  withConnection(
    'generateSigningSecret is refused for a provider that signs its own events',
    async () => {
      // The server refuses (writing nothing) exactly when the provider's
      // webhook triggers do not take a generated secret, which the
      // catalogue reports as providesBearerSecret. Anything else would set
      // or rotate the shared connection's secret, so check first.
      const { triggers: catalog } = await triggers.listAvailable(
        connectionId as string
      );
      if (!catalog.some((t) => t.mode === 'webhook')) {
        return skipAtRunTime(
          'SCALEKIT_TEST_TRIGGER_CONNECTION_ID has no webhook trigger'
        );
      }
      if (catalog.some((t) => t.providesBearerSecret)) {
        return skipAtRunTime(
          'SCALEKIT_TEST_TRIGGER_CONNECTION_ID takes a generated signing secret; ' +
            'generateSigningSecret would replace it'
        );
      }

      let outcome: unknown;
      try {
        outcome = await triggers.generateSigningSecret(connectionId as string);
      } catch (error) {
        outcome = error;
      }
      if (!(outcome instanceof Error)) {
        throw new Error(
          'generateSigningSecret succeeded although no trigger reports providesBearerSecret: ' +
            'SCALEKIT_TEST_TRIGGER_CONNECTION_ID now has a generated secret (and possibly an ' +
            'open rotation); point the fixture at another connection.'
        );
      }
      expect(outcome).toBeInstanceOf(ScalekitBadRequestException);
      expect((outcome as ScalekitBadRequestException).errorCode).toBe(
        'TRIGGER_SIGNING_SECRET_NOT_GENERATABLE'
      );
    }
  );

  liveIt('getActivity returns counts as numbers', async () => {
    const activity = await triggers.getActivity();
    expect(activity.windowSeconds).toBeGreaterThan(0);
    for (const value of Object.values(activity.counts)) {
      expect(typeof value).toBe('number');
    }
    expect(activity.explainsIndividualEvents).toBe(false);
  });

  withConnection(
    'createIngressEndpoint then getIngressEndpoint agree, or the provider has no webhook trigger',
    async () => {
      const id = connectionId as string;
      let createdEndpoint;
      try {
        createdEndpoint = await triggers.createIngressEndpoint(id);
      } catch (error) {
        // Only a provider without a webhook trigger may refuse.
        expect(error).toBeInstanceOf(ScalekitBadRequestException);
        expect((error as ScalekitBadRequestException).errorCode).toBe(
          'TRIGGER_INGRESS_NOT_APPLICABLE'
        );
        return;
      }
      const again = await triggers.createIngressEndpoint(id);
      expect(again.url).toBe(createdEndpoint.url); // idempotent
      const read = await triggers.getIngressEndpoint(id);
      expect(read.id).toBe(createdEndpoint.id);
      expect(read.url).toBe(createdEndpoint.url);
      expect(typeof read.signingSecretRotationId).toBe('number');
    }
  );

  withPoll('listEligibleAccounts lists the fixture account', async () => {
    let page = await triggers.listEligibleAccounts(
      pollConnectionId as string,
      pollTrigger as string,
      { pageSize: 100 }
    );
    expect(page.totalSize).toBeGreaterThan(0);
    const ids = page.accounts.map((a) => a.id);
    while (page.nextPageToken && !ids.includes(pollAccountId as string)) {
      page = await triggers.listEligibleAccounts(
        pollConnectionId as string,
        pollTrigger as string,
        { pageSize: 100, pageToken: page.nextPageToken }
      );
      ids.push(...page.accounts.map((a) => a.id));
    }
    expect(ids).toContain(pollAccountId);
  });

  withPoll(
    'createSubscription, a duplicate conflict, listSubscriptions, batch create and delete',
    async () => {
      const conn = pollConnectionId as string;
      const trigger = pollTrigger as string;
      const config = pollConfig();

      if ((await foreignFixtureSubscriptions()).length > 0) {
        return skipAtRunTime(
          'the fixture account already has subscriptions to the fixture trigger'
        );
      }

      const sub = await triggers.createSubscription(conn, trigger, {
        connectedAccountId: pollAccountId as string,
        config,
      });
      track(sub);
      expect(sub.id).toMatch(/^trgs_/);
      expect(sub.triggerName).toBe(trigger);
      expect(sub.createdAt).toBeInstanceOf(Date);
      expect(sub.effectiveIntervalSeconds).toBeGreaterThan(0);

      await expect(
        triggers.createSubscription(conn, trigger, {
          connectedAccountId: pollAccountId as string,
          config,
        })
      ).rejects.toBeInstanceOf(ScalekitConflictException);

      const page = await triggers.listSubscriptions(conn, {
        triggerName: trigger,
        pageSize: 100,
      });
      expect(Object.values(page.statusCounts).every(Number.isInteger)).toBe(
        true
      );
      expect(
        (await allSubscriptions(conn, trigger)).map((s) => s.id)
      ).toContain(sub.id);

      const batch = await triggers.batchCreateSubscriptions(conn, trigger, {
        connectedAccountIds: [pollAccountId as string, MISSING_ACCOUNT],
        config,
      });
      // ALREADY_SUBSCRIBED returns a subscription that may predate this run; track only new ones.
      for (const r of batch.results) {
        if (r.outcome === 'CREATED') track(r.subscription);
      }
      expect(batch.results).toHaveLength(2);
      expect(batch.results[0].outcome).toBe('ALREADY_SUBSCRIBED');
      expect(batch.results[1].connectedAccountId).toBe(MISSING_ACCOUNT);
      expect(batch.results[1].outcome).toBe('NOT_FOUND');

      await triggers.deleteSubscription(conn, sub.id);
      created.delete(sub.id);
      await expect(
        triggers.deleteSubscription(conn, sub.id)
      ).rejects.toBeInstanceOf(ScalekitNotFoundException);
    }
  );

  withPoll(
    'batchDeleteSubscriptions by trigger and account deletes, then reports NOT_FOUND',
    async () => {
      const conn = pollConnectionId as string;
      const trigger = pollTrigger as string;
      const account = pollAccountId as string;
      // This selector deletes every subscription the account has to the
      // trigger, so it runs only when all of them are this test's own.
      if ((await foreignFixtureSubscriptions()).length > 0) {
        return skipAtRunTime(
          'the fixture account already has subscriptions to the fixture trigger'
        );
      }

      const sub = await triggers.createSubscription(conn, trigger, {
        connectedAccountId: account,
        config: pollConfig(),
      });
      track(sub); // afterAll deletes it if an assertion below fails first

      const first = await triggers.batchDeleteSubscriptions(conn, {
        triggerName: trigger,
        connectedAccountIds: [account],
      });
      expect(first.deletedCount).toBe(1);
      expect(first.results).toHaveLength(1);
      expect(first.results[0]).toMatchObject({
        subscriptionId: sub.id,
        connectedAccountId: account,
        outcome: 'DELETED',
      });
      created.delete(sub.id);

      const again = await triggers.batchDeleteSubscriptions(conn, {
        triggerName: trigger,
        connectedAccountIds: [account],
      });
      expect(again.deletedCount).toBe(0);
      expect(again.results.length).toBeGreaterThan(0);
      for (const r of again.results) {
        expect(r.outcome).toBe('NOT_FOUND');
      }
    }
  );

  withEndpoint('lists deliveries and attempts on the endpoint', async () => {
    const ep = endpointId as string;
    const attempts = await triggers.listDeliveryAttemptsByEndpoint(ep, {
      pageSize: 5,
    });
    expect(Array.isArray(attempts.attempts)).toBe(true);

    const page = await triggers.listDeliveries(ep, { pageSize: 5 });
    expect(Array.isArray(page.deliveries)).toBe(true);
    const first = page.deliveries[0];
    if (first === undefined) return; // nothing delivered yet

    const byMessage = await triggers.listDeliveryAttemptsByMessage(
      ep,
      first.msgId
    );
    expect(byMessage.attempts.length).toBeGreaterThan(0);

    const details = await triggers.lookupDelivery(first.msgId);
    expect(details.msgId).toBe(first.msgId);

    const batch = await triggers.batchLookupDeliveries({
      deliveryIds: [first.msgId, MISSING_DELIVERY],
    });
    expect(batch.results.map((r) => r.outcome)).toEqual(['FOUND', 'NOT_FOUND']);
  });

  liveIt('an unknown delivery is not found', async () => {
    const error = await triggers
      .lookupDelivery(MISSING_DELIVERY)
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ScalekitNotFoundException);
    expect((error as ScalekitNotFoundException).errorCode).toBe('NOT_FOUND');
  });
});
