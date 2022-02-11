import { Bundle, ZObject } from "zapier-platform-core";
import { providers } from "near-api-js";
import { BlockChangeResult } from "near-api-js/lib/providers/provider";
import { TypedError } from "near-api-js/lib/providers";

import {
  BlockIDOrFinalityField,
  getBlockIDOrFinality,
  getNetwork,
  WithBlockIDOrFinality,
  WithNetworkSelection,
  NetworkSelectField,
} from "../../common";
import {
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
  OutputItem,
} from "../../../types";

export interface BlockChangesInput
  extends WithBlockIDOrFinality,
    WithNetworkSelection {}

export interface BlockChangesResponse extends BlockChangeResult, OutputItem {}

export async function perform(
  z: ZObject,
  { inputData }: Bundle<BlockChangesInput>
): Promise<Array<BlockChangesResponse>> {
  z.console.log(
    `Getting block details with input data: ${JSON.stringify(inputData)}`
  );

  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  try {
    const blockDetails = await rpc.blockChanges(
      getBlockIDOrFinality(inputData)
    );

    z.console.log("Got block details successfully");

    return [{ id: new Date().toISOString(), ...blockDetails }];
  } catch (error: unknown) {
    z.console.error(`Error getting block details: ${JSON.stringify(error)}`);

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
}

export default createSearch<BlockChangesInput, BlockChangesResponse>({
  key: "blockChanges",
  noun: "Changes in Block",

  display: {
    label: "Changes in Block",
    description:
      "Returns changes in block for given block height or hash. You can also use finality param to return latest block details.",
  },

  operation: {
    perform,
    inputFields: [NetworkSelectField, BlockIDOrFinalityField],
    sample: {
      id: "1",
      block_hash: "81k9ked5s34zh13EjJt26mxw5npa485SY4UNoPi6yYLo",
      changes: [
        {
          type: "account_touched",
          account_id: "lee.testnet",
        },
        {
          type: "contract_code_touched",
          account_id: "lee.testnet",
        },
        {
          type: "access_key_touched",
          account_id: "lee.testnet",
        },
      ],
    },
  },
});
