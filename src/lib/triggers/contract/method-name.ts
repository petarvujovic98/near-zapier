import { providers } from "near-api-js";
import { TypedError } from "near-api-js/lib/providers";
import { ContractCodeView } from "near-api-js/lib/providers/provider";
import { getMethodNames } from "near-contract-parser";
import { ZObject } from "zapier-platform-core";

import {
  Bundle,
  OutputItem,
  createTrigger,
  ErrorTypeCodes,
  ErrorTypes,
  FieldType,
} from "../../../types";
import {
  AccountIdField,
  WithAccountId,
  getNetwork,
  WithBlockIDOrFinality,
  getBlockIDOrFinalityForQuery,
  BlockIDOrFinalityField,
  validateAccountID,
} from "../../common";

export interface ViewMethodsInput
  extends WithAccountId,
    WithBlockIDOrFinality {}

export interface ViewMethodsResult extends OutputItem {
  name: string;
}

export const perform = async (
  z: ZObject,
  { inputData, authData }: Bundle<ViewMethodsInput>
): Promise<Array<ViewMethodsResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(authData) });

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

export default createTrigger<ViewMethodsInput, ViewMethodsResult>({
  key: "getMethodNames",
  noun: "Get Method Names",

  display: {
    label: "Get Method Names",
    description:
      "Triggers when selecting method names for the provided account ID.",
  },

  operation: {
    perform,
    inputFields: [BlockIDOrFinalityField, AccountIdField],
    outputFields: [
      { key: "name", label: "Method Name", type: FieldType.STRING },
    ],
    sample: {
      id: "get_balance",
      name: "get_balance",
    },
  },
});
