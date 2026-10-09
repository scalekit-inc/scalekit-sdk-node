/**
 * Any value that `JSON.parse` can return: a string, number, boolean, `null`,
 * an array of JSON values or a {@link JsonObject}.
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * A JSON object: string keys mapped to {@link JsonValue}s.
 */
export type JsonObject = { [key: string]: JsonValue };
