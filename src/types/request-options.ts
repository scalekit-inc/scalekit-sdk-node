/**
 * Per-call options accepted as the last argument of the methods that take
 * them (today `scalekit.actions.triggers.*`).
 *
 * @example
 * ```ts
 * const controller = new AbortController();
 * const catalog = await scalekit.actions.triggers.listAvailable('conn_123', {
 *   signal: controller.signal,
 *   timeoutMs: 5_000,
 * });
 * ```
 */
export interface RequestOptions {
  /**
   * Cancels the call, including any wait between retries. The call then
   * rejects with `ScalekitAbortError`, whose `cause` is the signal's `reason`.
   */
  signal?: AbortSignal;
  /**
   * Deadline for each attempt, in milliseconds. Must be a positive, finite
   * number. Defaults to the client's `timeoutMs` (20 seconds unless you set
   * it). A call that runs out of time rejects with
   * `ScalekitGatewayTimeoutException`.
   */
  timeoutMs?: number;
}
