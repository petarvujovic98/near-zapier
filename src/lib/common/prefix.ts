import { Field, FieldType } from "../../types";

/** A prefix input field */
export const PrefixField: Field = {
  key: "prefix",
  label: "Prefix",
  type: FieldType.STRING,
  helpText: "The key prefix of the contract state.",
  placeholder: "state_",
};

/** An interface that includes the key prefix. For use with Bundle object */
export interface WithPrefix {
  prefix?: string;
}

/**
 * Encode the key prefix input field to base64.
 *
 * @param  {string} prefix
 * @returns string
 */
export function encodeToBase64(prefix: string): string;
/**
 * Encode the key prefix of an input object containing a prefix field to base64.
 *
 * @param  {WithPrefix} {prefix}
 * @returns string
 */
export function encodeToBase64({ prefix }: WithPrefix): string;
/**
 * Encode a prefix key to base64.
 *
 * @param  {string|WithPrefix} params
 * @returns string
 */
export function encodeToBase64(params: string | WithPrefix): string {
  const prefix = typeof params === "string" ? params : params.prefix;

  return Buffer.from(prefix).toString("base64");
}
