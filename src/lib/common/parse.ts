import { CodeResult } from "near-api-js/lib/providers/provider";

/**
 * Parse an array of numbers as JSON.
 *
 * @param  {Array<number>} result
 * @returns any
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseBuffer(result: Array<number>): any;
/**
 * Parse an object containing a result field representing an array of numbers as JSON.
 *
 * @param  {CodeResult} {result}
 * @returns any
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseBuffer({ result }: CodeResult): any;
/**
 * Parse input result (array of numbers, or object containing a result field) as JSON.
 *
 * @param  {Array<number>|CodeResult} params
 * @returns any
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseBuffer(params: Array<number> | CodeResult): any {
  const result = Array.isArray(params) ? params : params.result;

  const buffer = Buffer.from(result);

  return JSON.parse(buffer.toString());
}
