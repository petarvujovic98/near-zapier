import { providers } from "near-api-js";
import { TypedError } from "near-api-js/lib/providers";
import { CodeResult } from "near-api-js/lib/providers/provider";
import { ZObject } from "zapier-platform-core";

import {
  Bundle,
  OutputItem,
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
} from "../../../types";
import {
  AccountIdField,
  WithAccountId,
  getNetwork,
  WithBlockIDOrFinality,
  getBlockIDOrFinalityForQuery,
  BlockIDOrFinalityField,
  parseBuffer,
  WithArguments,
  WithMethodName,
  MethodNameField,
  ArgumentsField,
  encodeToBase64,
  validateAccountID,
} from "../../common";
import MethodName from "../../triggers/contract/method-name";

export interface ViewFunctionInput
  extends WithAccountId,
    WithArguments,
    WithMethodName,
    WithBlockIDOrFinality {}

export interface ViewFunctionResult extends CodeResult, OutputItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsed_result: any;
}

export const perform = async (
  z: ZObject,
  { inputData, authData }: Bundle<ViewFunctionInput>
): Promise<Array<ViewFunctionResult>> => {
  if (!validateAccountID(inputData.accountId)) {
    throw new z.errors.Error(
      "Invalid contract ID",
      ErrorTypes.INVALID_DATA,
      ErrorTypeCodes.INVALID_DATA
    );
  }

  const rpc = new providers.JsonRpcProvider({ url: getNetwork(authData) });

  z.console.log(
    `Calling contract function with input data: ${JSON.stringify(inputData)}`
  );

  const args_base64 =
    inputData.arguments && Object.keys(inputData.arguments).length > 0
      ? encodeToBase64(JSON.stringify(inputData.arguments))
      : "";

  try {
    const code = await rpc.query<CodeResult>({
      request_type: "call_function",
      account_id: inputData.accountId,
      method_name: inputData.methodName,
      args_base64,
      ...getBlockIDOrFinalityForQuery(inputData),
    });

    z.console.log("Called contract function successfully");

    return [
      {
        id: new Date().toISOString(),
        ...code,
        parsed_result: parseBuffer(code.result),
      },
    ];
  } catch (error: unknown) {
    z.console.error(
      `Error calling contract function: ${JSON.stringify(error)}`
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

export default createSearch<ViewFunctionInput, ViewFunctionResult>({
  key: "callViewFunction",
  noun: "Call a Contract Function",

  display: {
    label: "Call a Contract Function",
    description: "Allows you to call a contract method as a view function.",
    important: true,
  },

  operation: {
    perform,
    inputFields: [
      BlockIDOrFinalityField,
      AccountIdField,
      { ...MethodNameField, dynamic: `${MethodName.key}.id.name` },
      ArgumentsField,
    ],
    sample: {
      id: "1",
      result: [48],
      logs: [],
      block_height: 17817336,
      block_hash: "4qkA4sUUG8opjH5Q9bL5mWJTnfR4ech879Db1BZXbx6P",
      parsed_result: 0,
    },
  },
});
