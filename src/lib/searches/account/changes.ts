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
  BlockIDOrFinalityField,
  WithAccountIdArray,
  getBlockIDOrFinality,
  AccountIdArrayField,
  validateAccountID,
} from "../../common";

export interface ViewAccountChangesInput
  extends WithAccountIdArray,
    WithBlockIDOrFinality {}

export interface ViewAccountChangesResult extends ChangeResult, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData, authData }: Bundle<ViewAccountChangesInput>
): Promise<Array<ViewAccountChangesResult>> => {
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
    `Getting account changes with input data: ${JSON.stringify(inputData)}`
  );

  try {
    const accountView = await rpc.accountChanges(
      inputData.accountIds,
      getBlockIDOrFinality(inputData)
    );

    z.console.log("Got account changes successfully");

    return [{ id: new Date().toISOString(), ...accountView }];
  } catch (error: unknown) {
    z.console.error(`Error getting account changes: ${JSON.stringify(error)}`);

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

export default createSearch<ViewAccountChangesInput, ViewAccountChangesResult>({
  key: "viewAccountChanges",
  noun: "View Account Changes",

  display: {
    label: "View Account Changes",
    description:
      "Returns account changes from transactions in a given account.",
  },

  operation: {
    perform,
    inputFields: [BlockIDOrFinalityField, AccountIdArrayField],
    sample: {
      id: "1",
      block_hash: "6xsfPSG89s6fCMShxxxQTP6D4ZHM9xkGCgubayTDRzAP",
      changes: [
        {
          cause: {
            type: "transaction_processing",
            tx_hash: "HLvxLKFM7gohFSqXPp5SpyydNEVpAno352qJJbnddsz3",
          },
          type: "account_update",
          change: {
            account_id: "your_account.testnet",
            amount: "499999959035075000000000000",
            locked: "0",
            code_hash: "11111111111111111111111111111111",
            storage_usage: 182,
            storage_paid_at: 0,
          },
        },
        {
          cause: {
            type: "receipt_processing",
            receipt_hash: "CPenN1dp4DNKnb9LiL5hkPmu1WiKLMuM7msDjEZwDmwa",
          },
          type: "account_update",
          change: {
            account_id: "your_account.testnet",
            amount: "499999959035075000000000000",
            locked: "0",
            code_hash: "11111111111111111111111111111111",
            storage_usage: 264,
            storage_paid_at: 0,
          },
        },
      ],
    },
  },
});
