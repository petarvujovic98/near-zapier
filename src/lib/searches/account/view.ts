import { providers } from "near-api-js";
import { TypedError } from "near-api-js/lib/providers";
import { AccountView } from "near-api-js/lib/providers/provider";
import { Bundle, ZObject } from "zapier-platform-core";

import {
  OutputItem,
  createSearch,
  ErrorTypes,
  ErrorTypeCodes,
} from "../../../types";
import {
  AccountIdField,
  WithAccountId,
  NetworkSelectField,
  WithNetworkSelection,
  getNetwork,
  WithBlockIDOrFinality,
  getBlockIDOrFinalityForQuery,
  BlockIDOrFinalityField,
  validateAccountID,
} from "../../common";

export interface ViewAccountInput
  extends WithNetworkSelection,
    WithAccountId,
    WithBlockIDOrFinality {}

export interface ViewAccountResult extends AccountView, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewAccountInput>
): Promise<Array<ViewAccountResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  if (!validateAccountID(inputData.accountId)) {
    throw new z.errors.Error(
      "Invalid account ID",
      ErrorTypes.INVALID_DATA,
      ErrorTypeCodes.INVALID_DATA
    );
  }

  z.console.log(
    `Getting account with input data: ${JSON.stringify(inputData)}`
  );

  try {
    const accountView = await rpc.query<AccountView>({
      request_type: "view_account",
      account_id: inputData.accountId,
      ...getBlockIDOrFinalityForQuery(inputData),
    });

    z.console.log("Got account successfully");

    return [{ id: new Date().toISOString(), ...accountView }];
  } catch (error: unknown) {
    z.console.error(`Error getting account: ${JSON.stringify(error)}`);

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

export default createSearch<ViewAccountInput, ViewAccountResult>({
  key: "viewAccount",
  noun: "View Account",
  display: {
    label: "View Account",
    description: "Returns basic account information.",
  },
  operation: {
    perform,
    inputFields: [NetworkSelectField, BlockIDOrFinalityField, AccountIdField],
    sample: {
      id: "1",
      amount: "399992611103597728750000000",
      locked: "0",
      code_hash: "11111111111111111111111111111111",
      storage_usage: 642,
      storage_paid_at: 0,
      block_height: 17795474,
      block_hash: "9MjpcnwW3TSdzGweNfPbkx8M74q1XzUcT1PAN8G5bNDz",
    },
  },
});
