import { Field, FieldType } from "../../types";

/** A transaction hash input field */
export const TXHashField: Field = {
  key: "txHash",
  label: "Transaction hash",
  helpText: "The hash of the transaction.",
  type: FieldType.STRING,
  placeholder: "6zgh2u9DqHHiXzdy9ouTP7oGky2T4nugqzqt9wJZwNFm",
};

/** An interface that includes the transaction hash. For use with Bundle object */
export interface WithTXHash {
  txHash: string;
}

/**
 * Encode a transaction hash field into an Uint8Array.
 *
 * @param  {string} txHash
 * @returns Uint8Array
 */
export function encodeToU8(txHash: string): Uint8Array;
/**
 * Encode a transaction hash from an object that includes it into an Uin8Array.
 *
 * @param  {WithTXHash} {txHash}
 * @returns Uint8Array
 */
export function encodeToU8({ txHash }: WithTXHash): Uint8Array;
/**
 * Encode a transaction hash into an Uint8Array.
 *
 * @param  {string|WithTXHash} param
 * @returns Uint8Array
 */
export function encodeToU8(param: string | WithTXHash): Uint8Array {
  const hash = typeof param === "string" ? param : param.txHash;
  const array = new Uint8Array(hash.length);

  hash.split("").forEach((character, index) => {
    array[index] = character.charCodeAt(0);
  });

  return array;
}
