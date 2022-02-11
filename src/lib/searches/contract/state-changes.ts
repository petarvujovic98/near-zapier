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
  AccountIdArrayField,
  NetworkSelectField,
  WithNetworkSelection,
  getNetwork,
  WithBlockIDOrFinality,
  BlockIDOrFinalityField,
  getBlockIDOrFinality,
  WithAccountIdArray,
  WithPrefix,
  encodeToBase64,
  PrefixField,
  validateAccountID,
} from "../../common";

export interface ViewContractStateChangesInput
  extends WithNetworkSelection,
    WithAccountIdArray,
    WithPrefix,
    WithBlockIDOrFinality {}

export interface ViewContractStateChangesResult
  extends ChangeResult,
    OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewContractStateChangesInput>
): Promise<Array<ViewContractStateChangesResult>> => {
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
    `Getting contract state changes with input data: ${JSON.stringify(
      inputData
    )}`
  );

  try {
    const stateChanges = await rpc.contractStateChanges(
      inputData.accountIds,
      getBlockIDOrFinality(inputData),
      inputData.prefix ? encodeToBase64(inputData) : undefined
    );

    z.console.log("Got contract state changes successfully");

    return [{ id: new Date().toISOString(), ...stateChanges }];
  } catch (error: unknown) {
    z.console.error(
      `Error getting contract state changes: ${JSON.stringify(error)}`
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
  ViewContractStateChangesInput,
  ViewContractStateChangesResult
>({
  key: "viewContractStateChanges",
  noun: "View Contract State Changes",
  display: {
    label: "View Contract State Changes",
    description:
      "Returns the state change details of a contract based on the key prefix (encoded to base64). Pass an empty string for this param if you would like to return all state changes.",
  },
  operation: {
    perform,
    inputFields: [
      NetworkSelectField,
      BlockIDOrFinalityField,
      AccountIdArrayField,
      PrefixField,
    ],
    sample: {
      id: "1",
      block_hash: "6U8Yd4JFZwJUNfqkD4KaKgTKmpNSmVRTSggpjmsRWdKY",
      changes: [
        {
          cause: {
            type: "receipt_processing",
            receipt_hash: "9ewznXgs2t7vRCssxW4thgaiwggnMagKybZ7ryLNTT2z",
          },
          type: "data_update",
          change: {
            account_id: "guest-book.testnet",
            key_base64: "bTo6Mzk=",
            value_base64:
              "eyJwcmVtaXVtIjpmYWxzZSwic2VuZGVyIjoiZmhyLnRlc3RuZXQiLCJ0ZXh0IjoiSGkifQ==",
          },
        },
        {
          cause: {
            type: "receipt_processing",
            receipt_hash: "9ewznXgs2t7vRCssxW4thgaiwggnMagKybZ7ryLNTT2z",
          },
          type: "data_update",
          change: {
            account_id: "guest-book.testnet",
            key_base64: "bTpsZW4=",
            value_base64: "NDA=",
          },
        },
      ],
    },
  },
});
