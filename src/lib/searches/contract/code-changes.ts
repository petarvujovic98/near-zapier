import { providers } from "near-api-js";
import { ChangeResult } from "near-api-js/lib/providers/provider";
import { Bundle, ZObject } from "zapier-platform-core";

import {
  OutputItem,
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
} from "../../../types";
import {
  AccountIdArrayField,
  NetworkSelectField,
  WithNetworkSelection,
  getNetwork,
  WithBlockIDOrFinality,
  BlockIDOrFinalityField,
  getBlockIDOrFinality,
  WithAccountIdArray,
  validateAccountID,
} from "../../common";

export interface ViewContractCodeChangesInput
  extends WithNetworkSelection,
    WithAccountIdArray,
    WithBlockIDOrFinality {}

export interface ViewContractCodeChangesResult
  extends ChangeResult,
    OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewContractCodeChangesInput>
): Promise<Array<ViewContractCodeChangesResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

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
    `Getting contract code changes with input data: ${JSON.stringify(
      inputData
    )}`
  );

  const codeChanges = await rpc.contractCodeChanges(
    inputData.accountIds,
    getBlockIDOrFinality(inputData)
  );

  z.console.log("Got contract code changes successfully");

  return [{ id: new Date().toISOString(), ...codeChanges }];
};

export default createSearch<
  ViewContractCodeChangesInput,
  ViewContractCodeChangesResult
>({
  key: "viewContractCodeChanges",
  noun: "View Contract Code Changes",
  display: {
    label: "View Contract Code Changes",
    description:
      "Returns code changes made when deploying a contract. Change is returned is a base64 encoded WASM file.",
  },
  operation: {
    perform,
    inputFields: [
      NetworkSelectField,
      BlockIDOrFinalityField,
      AccountIdArrayField,
    ],
    sample: {
      id: "1",
      block_hash: "3yLNV5zdpzRJ8HP5xTXcF7jdFxuHnmKNUwWcok4616WZ",
      changes: [
        {
          cause: {
            type: "receipt_processing",
            receipt_hash: "CEm3NNaNdu9cijh9NvZMM1srbtEYSsBVwGbZxFQYKt5B",
          },
          type: "contract_code_update",
          change: {
            account_id: "dev-1602714453032-7566969",
            code_base64:
              "AGFzbQEAAAABpAM3YAF/AGAAAX9gAn9+AGADf35+AGAEf35+fgF+YAZ/fn5+fn4BfmADf35+AX5gAn9+AX5gAn9/AX9gAn9/AGADf39/AX9gAX8BfmACfn4AYAF+AX5gAX4AYAABfmADfn5+AGAAAGAIfn5+fn5+fn4BfmAJfn5+fn5+fn5+AX5gAn5+AX5gA35+fgF+YAd+fn5+fn5+AGAEfn5+fgBgCX5+fn5+fn5+fgBgBX5+fn5+AX5gA39/fwBgAX8Bf2ACf3wAYAR/f39+AGAFf39/fn8AYAV/f39/fwBgBH9/f38AYAN/f38BfmADf39+AGACf38BfmAFf39/f38Bf2AEf39/fwF/YAZ/f39/f38AYAV/f35/fwBgBH9+f38Bf2ACf34Bf2AHf35+f39+fwBgBX9/f39+AGAEf35+fgBgCX9+fn5+fn5+fgF+YAp/fn5+fn5+fn5+AX5gCH9+fn5+fn5+AGAFf35+fn4AYAp/fn5+fn5+fn5+AGAHf39/f39/fwBgBH98f38Bf2AGf39/f39...",
          },
        },
      ],
    },
  },
});
