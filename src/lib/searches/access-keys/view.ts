import { providers } from "near-api-js";
import { TypedError } from "near-api-js/lib/providers";
import { AccessKeyView } from "near-api-js/lib/providers/provider";
import { ZObject } from "zapier-platform-core";

import {
  Bundle,
  OutputItem,
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
} from "../../../types";
import {
  AccessKeyField,
  WithAccessKey,
  AccountIdField,
  WithAccountId,
  getNetwork,
  WithBlockIDOrFinality,
  getBlockIDOrFinalityForQuery,
  BlockIDOrFinalityField,
  validateAccountID,
} from "../../common";

export interface ViewAccessKeyInput
  extends WithAccountId,
    WithAccessKey,
    WithBlockIDOrFinality {}

export interface ViewAccessKeyResult extends AccessKeyView, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData, authData }: Bundle<ViewAccessKeyInput>
): Promise<Array<ViewAccessKeyResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(authData) });

  if (!validateAccountID(inputData.accountId)) {
    throw new z.errors.Error(
      "Invalid account ID",
      ErrorTypes.INVALID_DATA,
      ErrorTypeCodes.INVALID_DATA
    );
  }

  z.console.log(
    `Getting access key with input data: ${JSON.stringify(inputData)}`
  );

  try {
    const accessKey = await rpc.query<AccessKeyView>({
      request_type: "view_access_key",
      account_id: inputData.accountId,
      public_key: inputData.accessKey,
      ...getBlockIDOrFinalityForQuery(inputData),
    });

    z.console.log("Got access key successfully");

    return [{ id: new Date().toISOString(), ...accessKey }];
  } catch (error: unknown) {
    z.console.error(`Error getting access key: ${JSON.stringify(error)}`);

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

export default createSearch<ViewAccessKeyInput, ViewAccessKeyResult>({
  key: "viewAccessKey",
  noun: "Access Key",

  display: {
    label: "View Access Key",
    description: `
			Returns information about a single access key for given account.
			If permission of the key is FunctionCall, it will return more details such as the allowance, receiver_id, and method_names.`,
  },

  operation: {
    perform,
    inputFields: [BlockIDOrFinalityField, AccountIdField, AccessKeyField],
    sample: {
      id: "1",
      nonce: 85,
      permission: {
        FunctionCall: {
          allowance: "18501534631167209000000000",
          receiver_id: "client.chainlink.testnet",
          method_names: ["get_token_price"],
        },
      },
      block_height: 19884918,
      block_hash: "GGJQ8yjmo7aEoj8ZpAhGehnq9BSWFx4xswHYzDwwAP2n",
    },
  },
});
