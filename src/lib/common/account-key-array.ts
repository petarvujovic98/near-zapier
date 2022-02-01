import { AccessKeyWithPublicKey } from "near-api-js/lib/providers/provider";

import { Field } from "../../types";

import { AccessKeyField } from "./access-key";
import { AccountIdField } from "./account";

import { WithAccessKey, WithAccountId } from ".";

/** An account ID and public key pair list input field */
export const AccountKeyArrayField: Field = {
  key: "accountKeyArray",
  label: "Account ID and Public Key pair list",
  children: [
    {
      ...AccountIdField,
      required: true,
    },
    {
      ...AccessKeyField,
      required: true,
    },
  ],
};

/** An interface that includes the account ID and access key */
export interface AccountKeyPair extends WithAccountId, WithAccessKey {}

/** An interface that includes an array of account ID-public key pairs */
export interface WithAccountKeyArray {
  accountKeyArray: Array<AccountKeyPair>;
}

/**
 * Maps the account ID and public key pair list input to the appropriate format for use
 * with the near-api-js provider.
 *
 * @param  {Parameter} {accountKeyArray}
 * @returns AccessKeyWithPublicKey[]
 */
export function getAccountIDPublicKeyPairs<
  Parameter extends WithAccountKeyArray = WithAccountKeyArray
>({ accountKeyArray }: Parameter): Array<AccessKeyWithPublicKey> {
  return accountKeyArray.map(
    ({ accountId: account_id, accessKey: public_key }) => ({
      account_id,
      public_key,
    })
  );
}
