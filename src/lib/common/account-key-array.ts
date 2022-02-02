import { AccessKeyWithPublicKey } from "near-api-js/lib/providers/provider";

import { Field } from "../../types";

/** An account ID and public key pair list input field */
export const AccountKeyArrayField: Field = {
  key: "accountKeyPairs",
  label: "Account ID and Public Key Pair",
  dict: true,
  helpText:
    "The keys represent the account IDs and the values are access keys.",
  // children: [
  //   {
  //     key: "lineItemId",
  //     type: FieldType.INTEGER,
  //     label: "Line Item ID",
  //     required: true,
  //   },
  //   {
  //     key: "name",
  //     type: FieldType.STRING,
  //     label: "Name",
  //     required: true,
  //   },
  //   {
  //     key: "description",
  //     type: FieldType.STRING,
  //     label: "Description",
  //   },
  // ],
};

/** An interface that includes the account ID and access key */
export interface AccountKeyPair {
  [accountId: string]: string;
}

/** An interface that includes an array of account ID-public key pairs */
export interface WithAccountKeyArray {
  accountKeyPairs: AccountKeyPair;
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
>({ accountKeyPairs }: Parameter): Array<AccessKeyWithPublicKey> {
  return Object.keys(accountKeyPairs).map((account_id) => ({
    account_id,
    public_key: accountKeyPairs[account_id],
  }));
}
