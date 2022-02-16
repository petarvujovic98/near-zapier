import { providers } from "near-api-js";
import { TypedError } from "near-api-js/lib/providers";
import { ChangeResult } from "near-api-js/lib/providers/provider";
import { ZObject } from "zapier-platform-core";

import {
  Bundle,
  OutputItem,
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
} from "../../../types";
import {
  getNetwork,
  WithBlockIDOrFinality,
  getBlockIDOrFinality,
  BlockIDOrFinalityField,
  WithAccountIdArray,
  AccountIdArrayField,
  validateAccountID,
} from "../../common";

export interface ViewAccessKeysChangesInput
  extends WithAccountIdArray,
    WithBlockIDOrFinality {}

export interface ViewAccessKeysChangesResult extends ChangeResult, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData, authData }: Bundle<ViewAccessKeysChangesInput>
): Promise<Array<ViewAccessKeysChangesResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(authData) });

  inputData.accountIds.forEach((accountId) => {
    if (!validateAccountID(accountId)) {
      throw new z.errors.Error(
        `Invalid account ID for account: ${accountId}`,
        ErrorTypes.INVALID_DATA,
        ErrorTypeCodes.INVALID_DATA
      );
    }
  });

  z.console.log(
    `Getting access keys' changes with input data: ${JSON.stringify(inputData)}`
  );

  try {
    const accessKeysChanges = await rpc.accessKeyChanges(
      inputData.accountIds,
      getBlockIDOrFinality(inputData)
    );

    z.console.log("Got access keys' changes successfully");

    return [{ id: new Date().toISOString(), ...accessKeysChanges }];
  } catch (error: unknown) {
    z.console.error(
      `Error getting access keys' changes: ${JSON.stringify(error)}`
    );

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
  ViewAccessKeysChangesInput,
  ViewAccessKeysChangesResult
>({
  key: "viewAccessKeyChangesAll",
  noun: "Access Key Changes (All)",

  display: {
    label: "View Access Key Changes (All)",
    description:
      "Returns changes to all access keys of a specific block. Multiple accounts can be quereied by passing an array of account_ids.",
  },

  operation: {
    perform,
    inputFields: [BlockIDOrFinalityField, AccountIdArrayField],
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
        {
          cause: {
            type: "receipt_processing",
            receipt_hash: "CetXstu7bdqyUyweRqpY9op5U1Kqzd8pq8T1kqfcgBv2",
          },
          type: "access_key_update",
          change: {
            account_id: "example-acct.testnet",
            public_key: "ed25519:96pj2aVJH9njmAxakjvUMnNvdB3YUeSAMjbz9aRNU6XY",
            access_key: {
              nonce: 0,
              permission: "FullAccess",
            },
          },
        },
      ],
    },
  },
});
