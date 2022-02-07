import { providers } from "near-api-js";
import { CodeResult } from "near-api-js/lib/providers/provider";
import { Bundle, ZObject } from "zapier-platform-core";

import { OutputItem, createSearch } from "../../../types";
import {
  AccountIdField,
  WithAccountId,
  NetworkSelectField,
  WithNetworkSelection,
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
} from "../../common";
import MethodName from "../../triggers/contract/method-name";

export interface ViewFunctionInput
  extends WithNetworkSelection,
    WithAccountId,
    WithArguments,
    WithMethodName,
    WithBlockIDOrFinality {}

export interface ViewFunctionResult extends CodeResult, OutputItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsed_result: any;
}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewFunctionInput>
): Promise<Array<ViewFunctionResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  z.console.log(
    `Calling contract function with input data: ${JSON.stringify(inputData)}`
  );

  const args_base64 =
    inputData.arguments && Object.keys(inputData.arguments).length > 0
      ? encodeToBase64(JSON.stringify(inputData.arguments))
      : "";

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
};

export default createSearch<ViewFunctionInput, ViewFunctionResult>({
  key: "callViewFunction",
  noun: "Call a Contract Function",
  display: {
    label: "Call a Contract Function",
    description: "Allows you to call a contract method as a view function.",
  },
  operation: {
    perform,
    inputFields: [
      NetworkSelectField,
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
