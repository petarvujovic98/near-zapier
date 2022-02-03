import { providers } from "near-api-js";
import { Bundle, ZObject } from "zapier-platform-core";

import { createSearch, OutputItem } from "../../../types";
import {
  getNetwork,
  WithNetworkSelection,
  NetworkSelectField,
  BlockIDField,
  WithBlockIDOrFinality,
} from "../../common";

export interface GasPriceInput
  extends WithNetworkSelection,
    WithBlockIDOrFinality {}

export interface GasPriceResult extends OutputItem {
  gasPrice: string;
}

export async function perform(
  z: ZObject,
  { inputData }: Bundle<GasPriceInput>
): Promise<Array<GasPriceResult>> {
  const rpc = new providers.JsonRpcProvider({
    url: getNetwork(inputData),
  });

  z.console.log(
    `Getting gas price with input data: ${JSON.stringify(inputData)}`
  );

  const { gas_price: gasPrice } = await rpc.gasPrice(inputData.blockId || null);

  z.console.log(`Got gas price successfully`);

  return [{ id: new Date().toISOString(), gasPrice }];
}

export default createSearch<GasPriceInput, GasPriceResult>({
  key: "gasPrice",
  noun: "Gas Price",

  display: {
    label: "Gas Price",
    description: `\
		Returns gas price for a specific block_height or block_hash.
		Using [null] will return the most recent block's gas price.`,
  },

  operation: {
    inputFields: [NetworkSelectField, BlockIDField],
    perform,
    sample: {
      id: new Date().toISOString(),
      gasPrice: "1",
    },
  },
});
