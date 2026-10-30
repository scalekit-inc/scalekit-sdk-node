/**
 * Live negative tests for scalekit.actions.triggers against a real
 * environment. The whole file is skipped unless SCALEKIT_ENVIRONMENT_URL,
 * SCALEKIT_CLIENT_ID and SCALEKIT_CLIENT_SECRET hold real values
 * (placeholders such as "dummy" or an `.invalid` host count as unset).
 *
 * Nothing else is needed. Every case sends IDs that name nothing, or
 * arguments the server refuses, so no test creates, changes or delivers
 * anything in the environment.
 *
 * - Arguments the server refuses on their own (a batch that is too long, a
 *   signing secret that is too short) are refused whether or not triggers are
 *   enabled for the environment, so those cases always run.
 * - An environment without triggers answers every other call with 404
 *   RESOURCE_NOT_FOUND ("not found"). One case checks exactly that and runs
 *   only there; the cases that need triggers enabled return early there, with
 *   a warning.
 *
 * Positive behaviour (subscriptions, signing secrets, deliveries) needs
 * connections and a delivery endpoint to exist, so it is covered by the unit
 * tests in triggers-management.test.ts.
 */
import { describe, expect, it } from '@jest/globals';
import ScalekitClient from '../src/scalekit';
import {
  ScalekitBadRequestException,
  ScalekitNotFoundException,
  ScalekitServerException,
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

// Its own client, so this file doesn't depend on the shared setup. The
// constructor makes no requests, so placeholders are harmless when skipped.
const scalekit = new ScalekitClient(
  env.SCALEKIT_ENVIRONMENT_URL || 'https://unset.invalid',
  env.SCALEKIT_CLIENT_ID || 'unset',
  env.SCALEKIT_CLIENT_SECRET || 'unset'
);

// Well formed, and outside the range of IDs any environment issues.
const UNKNOWN_CONNECTION = 'conn_912345678901234567';
const UNKNOWN_ACCOUNT = 'ca_912345678901234567';
const UNKNOWN_SUBSCRIPTION = 'trgs_912345678901234567';
const UNKNOWN_ENDPOINT = 'ep_sdklivetestunknown';
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

let availability: Promise<boolean> | undefined;

/**
 * Whether triggers are enabled for this environment, asked once. getActivity
 * takes no IDs, so a 404 RESOURCE_NOT_FOUND from it can only mean triggers
 * are not enabled. Any other error fails the case.
 */
function triggersEnabled(): Promise<boolean> {
  availability ??= scalekit.actions.triggers.getActivity().then(
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

/** A case that runs only where triggers are enabled for the environment. */
function enabledIt(name: string, fn: () => Promise<void>): void {
  it(name, async () => {
    if (!(await triggersEnabled())) {
      console.warn(`skipped: triggers are not enabled for this environment`);
      return;
    }
    await fn();
  });
}

/** The error `promise` rejects with; fails when it resolves. */
async function rejection(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('expected the call to be refused, but it succeeded');
}

/** `promise` rejects with `type`, `errorCode` and (when given) `message` in its text. */
async function expectRefused(
  promise: Promise<unknown>,
  type: typeof ScalekitBadRequestException | typeof ScalekitNotFoundException,
  errorCode: string,
  message?: string
): Promise<ScalekitServerException> {
  const error = await rejection(promise);
  expect(error).toBeInstanceOf(type);
  const serverError = error as ScalekitServerException;
  expect(serverError.errorCode).toBe(errorCode);
  if (message !== undefined) expect(serverError.message).toContain(message);
  return serverError;
}

(enabled ? describe : describe.skip)(
  'actions.triggers (live, negative)',
  () => {
    describe('an environment without triggers', () => {
      it('answers every call with 404 RESOURCE_NOT_FOUND', async () => {
        if (await triggersEnabled()) {
          console.warn('skipped: triggers are enabled for this environment');
          return;
        }
        const triggers = scalekit.actions.triggers;
        for (const call of [
          () => triggers.getActivity(),
          () => triggers.getUsage({ period: '24h' }),
          () => triggers.listAvailable(UNKNOWN_CONNECTION),
          () => triggers.lookupDelivery('msg_sdklivetestunknown'),
        ]) {
          const error = await expectRefused(
            call(),
            ScalekitNotFoundException,
            'RESOURCE_NOT_FOUND'
          );
          expect(error.httpStatus).toBe(404);
          // "connection not found" would mean triggers are enabled after all.
          expect(error.message).not.toContain('connection');
        }
      });
    });

    describe('arguments refused before triggers are looked at', () => {
      it('batchCreateSubscriptions with more than 100 accounts', async () => {
        const error = await expectRefused(
          scalekit.actions.triggers.batchCreateSubscriptions(
            UNKNOWN_CONNECTION,
            'example.item.created',
            {
              connectedAccountIds: Array.from(
                { length: 101 },
                (_, i) => `ca_${i + 1}`
              ),
            }
          ),
          ScalekitBadRequestException,
          'INVALID_ARGUMENT'
        );
        expect(error.httpStatus).toBe(400);
      });

      it('batchCreateSubscriptions with a repeated account', async () => {
        await expectRefused(
          scalekit.actions.triggers.batchCreateSubscriptions(
            UNKNOWN_CONNECTION,
            'example.item.created',
            { connectedAccountIds: [UNKNOWN_ACCOUNT, UNKNOWN_ACCOUNT] }
          ),
          ScalekitBadRequestException,
          'INVALID_ARGUMENT'
        );
      });

      it('setSigningSecret with a secret shorter than 8 characters', async () => {
        await expectRefused(
          scalekit.actions.triggers.setSigningSecret(UNKNOWN_CONNECTION, {
            signingSecret: 'abc',
          }),
          ScalekitBadRequestException,
          'INVALID_ARGUMENT'
        );
      });

      it('listDeliveryAttemptsByMessage with a malformed message ID', async () => {
        await expectRefused(
          scalekit.actions.triggers.listDeliveryAttemptsByMessage(
            UNKNOWN_ENDPOINT,
            'not-a-message-id'
          ),
          ScalekitBadRequestException,
          'INVALID_ARGUMENT'
        );
      });

      it('batchLookupDeliveries with more than 25 IDs', async () => {
        await expectRefused(
          scalekit.actions.triggers.batchLookupDeliveries({
            deliveryIds: Array.from(
              { length: 26 },
              (_, i) => `msg_sdklivetest${i}`
            ),
          }),
          ScalekitBadRequestException,
          'INVALID_ARGUMENT'
        );
      });
    });

    describe('unknown or malformed IDs', () => {
      enabledIt('an unknown connection is not found', async () => {
        const triggers = scalekit.actions.triggers;
        const calls: Record<string, () => Promise<unknown>> = {
          listAvailable: () => triggers.listAvailable(UNKNOWN_CONNECTION),
          listEligibleAccounts: () =>
            triggers.listEligibleAccounts(
              UNKNOWN_CONNECTION,
              'example.item.created'
            ),
          listSubscriptions: () =>
            triggers.listSubscriptions(UNKNOWN_CONNECTION),
          createSubscription: () =>
            triggers.createSubscription(
              UNKNOWN_CONNECTION,
              'example.item.created',
              { connectedAccountId: UNKNOWN_ACCOUNT }
            ),
          batchCreateSubscriptions: () =>
            triggers.batchCreateSubscriptions(
              UNKNOWN_CONNECTION,
              'example.item.created',
              { connectedAccountIds: [UNKNOWN_ACCOUNT] }
            ),
          getIngressEndpoint: () =>
            triggers.getIngressEndpoint(UNKNOWN_CONNECTION),
          createIngressEndpoint: () =>
            triggers.createIngressEndpoint(UNKNOWN_CONNECTION),
          setSigningSecret: () =>
            triggers.setSigningSecret(UNKNOWN_CONNECTION, {
              signingSecret: 'sdk-live-test-secret',
            }),
          confirmSigningSecretRotation: () =>
            triggers.confirmSigningSecretRotation(UNKNOWN_CONNECTION),
          generateSigningSecret: () =>
            triggers.generateSigningSecret(UNKNOWN_CONNECTION),
        };
        for (const [name, call] of Object.entries(calls)) {
          const error = await expectRefused(
            call(),
            ScalekitNotFoundException,
            'RESOURCE_NOT_FOUND',
            'connection not found'
          ).catch((e: unknown) => {
            throw new Error(`${name}: ${String(e)}`);
          });
          expect(error.httpStatus).toBe(404);
        }
      });

      enabledIt('a malformed connection ID is refused', async () => {
        await expectRefused(
          scalekit.actions.triggers.listAvailable('conn_not-a-number'),
          ScalekitBadRequestException,
          'INVALID_ARGUMENT',
          'invalid connection_id'
        );
      });

      enabledIt('deleting an unknown subscription is not found', async () => {
        await expectRefused(
          scalekit.actions.triggers.deleteSubscription(
            UNKNOWN_CONNECTION,
            UNKNOWN_SUBSCRIPTION
          ),
          ScalekitNotFoundException,
          'RESOURCE_NOT_FOUND',
          'trigger subscription not found'
        );
      });

      enabledIt('deleting a malformed subscription ID is refused', async () => {
        await expectRefused(
          scalekit.actions.triggers.deleteSubscription(
            UNKNOWN_CONNECTION,
            'trgs_not-a-number'
          ),
          ScalekitBadRequestException,
          'INVALID_ARGUMENT',
          'invalid subscription_id'
        );
      });

      enabledIt(
        'batchDeleteSubscriptions reports an unknown subscription per item',
        async () => {
          const batch =
            await scalekit.actions.triggers.batchDeleteSubscriptions(
              UNKNOWN_CONNECTION,
              { subscriptionIds: [UNKNOWN_SUBSCRIPTION] }
            );
          expect(batch.deletedCount).toBe(0);
          expect(batch.results).toHaveLength(1);
          expect(batch.results[0]).toMatchObject({
            subscriptionId: UNKNOWN_SUBSCRIPTION,
            outcome: 'NOT_FOUND',
          });
        }
      );

      enabledIt(
        'batchDeleteSubscriptions with both selectors is refused',
        async () => {
          await expectRefused(
            scalekit.actions.triggers.batchDeleteSubscriptions(
              UNKNOWN_CONNECTION,
              {
                subscriptionIds: [UNKNOWN_SUBSCRIPTION],
                triggerName: 'example.item.created',
              }
            ),
            ScalekitBadRequestException,
            'INVALID_ARGUMENT',
            'selector'
          );
        }
      );
    });

    describe('ranges and filters the server refuses', () => {
      const daysFromToday = (days: number) =>
        new Date(Date.now() + days * DAY_MS).toISOString().slice(0, 10);

      enabledIt('getUsage with from after to', async () => {
        await expectRefused(
          scalekit.actions.triggers.getUsage({
            from: daysFromToday(-1),
            to: daysFromToday(-5),
          }),
          ScalekitBadRequestException,
          'INVALID_ARGUMENT'
        );
      });

      enabledIt('getUsage starting in the future', async () => {
        await expectRefused(
          scalekit.actions.triggers.getUsage({
            from: daysFromToday(3),
            to: daysFromToday(4),
          }),
          ScalekitBadRequestException,
          'INVALID_ARGUMENT'
        );
      });

      enabledIt('listDeliveries refuses bad filters', async () => {
        // Checked before the delivery endpoint is looked up.
        const now = Date.now();
        for (const params of [
          { after: new Date(now), before: new Date(now - HOUR_MS) },
          { pageToken: 'not-a-token' },
          { channel: 'slack' },
        ]) {
          await expectRefused(
            scalekit.actions.triggers.listDeliveries(UNKNOWN_ENDPOINT, params),
            ScalekitBadRequestException,
            'INVALID_ARGUMENT'
          );
        }
      });

      enabledIt('lookups by attempt ID are refused', async () => {
        await expectRefused(
          scalekit.actions.triggers.lookupDelivery('atmpt_sdklivetest'),
          ScalekitBadRequestException,
          'INVALID_ARGUMENT',
          'attempt ids are not accepted'
        );
        await expectRefused(
          scalekit.actions.triggers.batchLookupDeliveries({
            deliveryIds: ['atmpt_sdklivetest'],
          }),
          ScalekitBadRequestException,
          'INVALID_ARGUMENT',
          'attempt ids are not accepted'
        );
      });

      enabledIt('batchResendDeliveries with a repeated target', async () => {
        const target = {
          msgId: 'msg_sdklivetest',
          endpointId: UNKNOWN_ENDPOINT,
        };
        await expectRefused(
          scalekit.actions.triggers.batchResendDeliveries({
            targets: [target, { ...target }],
          }),
          ScalekitBadRequestException,
          'INVALID_ARGUMENT',
          'duplicate target'
        );
      });

      enabledIt('recoverDeliveries refuses a bad window', async () => {
        // The window is checked before the delivery endpoint is looked up.
        const now = Date.now();
        for (const params of [
          { since: new Date(now + HOUR_MS) },
          {
            since: new Date(now - HOUR_MS),
            until: new Date(now - 2 * HOUR_MS),
          },
          { since: new Date(now - 15 * DAY_MS) },
        ]) {
          await expectRefused(
            scalekit.actions.triggers.recoverDeliveries(
              UNKNOWN_ENDPOINT,
              params
            ),
            ScalekitBadRequestException,
            'INVALID_ARGUMENT'
          );
        }
      });
    });
  }
);
