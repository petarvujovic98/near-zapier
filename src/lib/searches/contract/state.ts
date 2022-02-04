import { providers } from "near-api-js";
import { ViewStateResult } from "near-api-js/lib/providers/provider";
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
  WithPrefix,
  PrefixField,
  encodeToBase64,
} from "../../common";

export interface ViewContractStateInput
  extends WithNetworkSelection,
    WithAccountId,
    WithPrefix,
    WithBlockIDOrFinality {}

export interface ViewContractStateResult extends ViewStateResult, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewContractStateInput>
): Promise<Array<ViewContractStateResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  z.console.log(
    `Getting contract state with input data: ${JSON.stringify(inputData)}`
  );

  const state = await rpc.query<ViewStateResult>({
    request_type: "view_code",
    account_id: inputData.accountId,
    prefix_base64: inputData.prefix ? encodeToBase64(inputData) : "",
    ...getBlockIDOrFinalityForQuery(inputData),
  });

  z.console.log("Got contract state successfully");

  return [{ id: new Date().toISOString(), ...state }];
};

export default createSearch<ViewContractStateInput, ViewContractStateResult>({
  key: "viewContractState",
  noun: "View Contract State",
  display: {
    label: "View Contract State",
    description:
      "Returns the state (key value pairs) of a contract based on the key prefix (base64 encoded). Pass an empty string for prefix_base64 if you would like to return the entire state. Please note that the returned state will be base64 encoded as well.",
  },
  operation: {
    perform,
    inputFields: [
      NetworkSelectField,
      BlockIDOrFinalityField,
      AccountIdField,
      PrefixField,
    ],
    sample: {
      id: "1",
      values: [
        {
          key: "bTo6MA==",
          value:
            "eyJwcmVtaXVtIjp0cnVlLCJzZW5kZXIiOiJqb3NoZm9yZC50ZXN0bmV0IiwidGV4dCI6ImhlbGxvIn0=",
          proof: [],
        },
        {
          key: "bTo6MQ==",
          value:
            "eyJwcmVtaXVtIjpmYWxzZSwic2VuZGVyIjoiY2hhZG9oIiwidGV4dCI6ImhlbGxvIGVyeWJvZHkifQ==",
          proof: [],
        },
        {
          key: "bTo6MTA=",
          value:
            "eyJwcmVtaXVtIjpmYWxzZSwic2VuZGVyIjoic2F0b3NoaWYudGVzdG5ldCIsInRleHQiOiJIaWxsbyEifQ==",
          proof: [],
        },
        {
          key: "bTo6MTk=",
          value:
            "eyJwcmVtaXVtIjpmYWxzZSwic2VuZGVyIjoidGVzdC1kcm9wLTEwLnRlc3RuZXQiLCJ0ZXh0IjoiV2hlbiBJQ08/In0=",
          proof: [],
        },
        {
          key: "bTo6MjY=",
          value:
            "eyJwcmVtaXVtIjp0cnVlLCJzZW5kZXIiOiJtYXN0ZXJ0aHlzZWxmLnRlc3RuZXQiLCJ0ZXh0IjoiYnVpbGQsIGJ1aWxkLCBidWlsZCBpIGNhbWUgdG8gYnVpbGQgYSBicmlkZ2UgaW4gUEVBQ0UsIHNvIGNvbWUgbGV0cyBidWlsZC4uLnNvbmcgYnkgXCJOYWhrbyBCZWFyXCIgIn0=",
          proof: [],
        },
        {
          key: "bTo6Mjc=",
          value:
            "eyJwcmVtaXVtIjp0cnVlLCJzZW5kZXIiOiJtYXN0ZXJ0aHlzZWxmLnRlc3RuZXQiLCJ0ZXh0IjoiYnVpbGQgYSBicmlkZ2UgKGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vdXJsP3NhPXQmcmN0PWomcT0mZXNyYz1zJnNvdXJjZT13ZWImY2Q9JmNhZD1yamEmdWFjdD04JnZlZD0yYWhVS0V3ajA0ZGlnMTlqckFoV05tbGtLSGR5X0FnUVEzeXd3QUhvRUNBVVFBZyZ1cmw9aHR0cHMlM0ElMkYlMkZ3d3cueW91dHViZS5jb20lMkZ3YXRjaCUzRnYlM0Rlb1RYNWZmOVplMCZ1c2c9QU92VmF3MFoxZzFIMkZzeF85d3FJSmg5RTk2UCkifQ==",
          proof: [],
        },
      ],
      proof: [],
      block_height: 17814234,
      block_hash: "GT1D8nweVQU1zyCUv399x8vDv2ogVq71w17MyR66hXBB",
    },
  },
});
