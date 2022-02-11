import { providers } from "near-api-js";
import { TypedError } from "near-api-js/lib/providers";
import { ChangeResult } from "near-api-js/lib/providers/provider";
import { Bundle, ZObject } from "zapier-platform-core";

import {
  OutputItem,
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
} from "../../../types";
import {
  NetworkSelectField,
  WithNetworkSelection,
  getNetwork,
  WithBlockIDOrFinality,
  getBlockIDOrFinality,
  getAccountIDPublicKeyPairs,
  WithAccountKeyArray,
  AccountKeyArrayField,
  BlockIDOrFinalityField,
  validateAccountID,
} from "../../common";

export interface ViewAccessKeyChangesInput
  extends WithNetworkSelection,
    WithAccountKeyArray,
    WithBlockIDOrFinality {}

export interface ViewAccessKeyChangesResult extends ChangeResult, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewAccessKeyChangesInput>
): Promise<Array<ViewAccessKeyChangesResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  const accountIdPublicKeyPairs = getAccountIDPublicKeyPairs(inputData);

  accountIdPublicKeyPairs.forEach(({ account_id }) => {
    if (!validateAccountID(account_id)) {
      throw new z.errors.Error(
        `Invalid account ID for account: ${account_id}`,
        ErrorTypes.INVALID_DATA,
        ErrorTypeCodes.INVALID_DATA
      );
    }
  });

  z.console.log(
    `Getting access key list with input data: ${JSON.stringify(inputData)}`
  );

  try {
    const accessKeyChanges = await rpc.singleAccessKeyChanges(
      accountIdPublicKeyPairs,
      getBlockIDOrFinality(inputData)
    );

    z.console.log("Got access key list successfully");

    return [{ id: new Date().toISOString(), ...accessKeyChanges }];
  } catch (error: unknown) {
    z.console.error(`Error getting access key list: ${JSON.stringify(error)}`);

    if (error instanceof TypedError) {
      throw new z.errors.Error(
        error.message,
        error.name,
        ErrorTypeCodes.NEAR_API_JS
      );
    }

    throw new z.errors.Error(
      error.toString(),
      ErrorTypes.UNKNOWN,
      ErrorTypeCodes.NEAR_API_JS
    );
  }
};

export default createSearch<
  ViewAccessKeyChangesInput,
  ViewAccessKeyChangesResult
>({
  key: "viewAccessKeyChangesSingle",
  noun: "Access Key Changes (Single)",
  display: {
    label: "View access key changes (single)",
    description:
      "Returns individual access key changes in a specific block. You can query multiple keys by passing an array of objects containing the account_id and public_key.",
  },
  operation: {
    perform,
    inputFields: [
      NetworkSelectField,
      BlockIDOrFinalityField,
      AccountKeyArrayField,
    ],
    sample: {
      id: "1",
      block_hash: "4kvqE1PsA6ic1LG7S5SqymSEhvjqGqumKjAxnVdNN3ZH",
      changes: [
        {
          cause: {
            type: "transaction_processing",
            tx_hash: "HshPyqddLxsganFxHHeH9LtkGekXDCuAt6axVgJLboXV",
          },
          type: "access_key_update",
          change: {
            account_id: "example-acct.testnet",
            public_key: "ed25519:25KEc7t7MQohAJ4EDThd2vkksKkwangnuJFzcoiXj9oM",
            access_key: {
              nonce: 1,
              permission: "FullAccess",
            },
          },
        },
      ],
    },
  },
});
