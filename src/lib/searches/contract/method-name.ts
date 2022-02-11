import { providers } from "near-api-js";
import { TypedError } from "near-api-js/lib/providers";
import { ContractCodeView } from "near-api-js/lib/providers/provider";
import { getMethodNames } from "near-contract-parser";
import { Bundle, ZObject } from "zapier-platform-core";

import {
  OutputItem,
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
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

export interface ViewMethodsInput
  extends WithNetworkSelection,
    WithAccountId,
    WithBlockIDOrFinality {}

export interface ViewMethodsResult extends OutputItem {
  name: string;
}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewMethodsInput>
): Promise<Array<ViewMethodsResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  if (!validateAccountID(inputData.accountId)) {
    throw new z.errors.Error(
      "Invalid account ID",
      ErrorTypes.INVALID_DATA,
      ErrorTypeCodes.INVALID_DATA
    );
  }

  z.console.log(
    `Getting contract method names with input data: ${JSON.stringify(
      inputData
    )}`
  );

  try {
    const { code_base64 } = await rpc.query<ContractCodeView>({
      request_type: "view_code",
      account_id: inputData.accountId,
      ...getBlockIDOrFinalityForQuery(inputData),
    });

    z.console.log("Got contract method names successfully");

    return getMethodNames(code_base64).map((name) => ({ id: name, name }));
  } catch (error: unknown) {
    z.console.error(
      `Error getting contract method names: ${JSON.stringify(error)}`
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

export default createSearch<ViewMethodsInput, ViewMethodsResult>({
  key: "getMethodNames",
  noun: "Get method names",
  display: {
    label: "Get method names",
    description:
      "Returns a list of method names on the contract for the provided account ID.",
  },
  operation: {
    perform,
    inputFields: [NetworkSelectField, BlockIDOrFinalityField, AccountIdField],
    sample: {
      id: "get_balance",
      name: "get_balance",
    },
  },
});
