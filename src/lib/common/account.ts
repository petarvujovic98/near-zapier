import { Field, FieldType } from "../../types/fields";

const ACCOUNT_ID_REGEX =
  /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;

/** An account ID input field */
export const AccountIdField: Field = {
  key: "accountId",
  label: "Account ID",
  helpText: "The ID of the account.",
  type: FieldType.STRING,
  placeholder: "petarvujovic.testnet",
};

/** An interface that includes the account ID. For use with Bundle object */
export interface WithAccountId {
  accountId: string;
}

/**
 * Validate account ID from an object containing an account ID field.
 *
 * @param  {{accountId:string;}} {accountId}
 * @returns boolean
 */
export function validateAccountID({
  accountId,
}: {
  accountId: string;
}): boolean;
/**
 * Validate account ID field.
 *
 * @param  {string} accountId
 * @returns boolean
 */
export function validateAccountID(accountId: string): boolean;
/**
 * Validate an account ID.
 *
 * @param  {string|{accountId:string}} params
 * @returns boolean
 */
export function validateAccountID(
  params: string | { accountId: string }
): boolean {
  const accountId = typeof params === "string" ? params : params.accountId;

  return (
    2 <= accountId.length &&
    accountId.length <= 64 &&
    ACCOUNT_ID_REGEX.test(accountId)
  );
}
