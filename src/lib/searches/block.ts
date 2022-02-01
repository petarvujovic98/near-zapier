import { Bundle, ZObject } from "zapier-platform-core";
import { providers } from "near-api-js";
import { BlockResult } from "near-api-js/lib/providers/provider";

import {
  BlockIDOrFinalityField,
  getBlockIDOrFinality,
  getNetwork,
  WithBlockIDOrFinality,
  WithNetworkSelection,
} from "../common";
import { createSearch } from "../../types/search";
import { OutputItem } from "../../types/operation";

export interface SearchBlock
  extends WithBlockIDOrFinality,
    WithNetworkSelection {}

export interface BlockDetails extends BlockResult, OutputItem {}

export async function perform(
  z: ZObject,
  { inputData }: Bundle<SearchBlock>
): Promise<Array<BlockDetails>> {
  z.console.log(
    `Getting gas price with input data: ${JSON.stringify(inputData)}`
  );

  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  const blockDetails = await rpc.block(getBlockIDOrFinality(inputData));

  return [{ id: new Date().toISOString(), ...blockDetails }];
}

export default createSearch({
  key: "block",
  noun: "Block",

  display: {
    label: "Block",
    description: "Find a block by ID or height.",
  },

  operation: {
    perform,
    inputFields: [BlockIDOrFinalityField],
    sample: {
      id: "1",
    },
  },
});
