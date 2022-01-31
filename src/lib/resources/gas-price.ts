import { providers } from "near-api-js";
import { Bundle, ZObject } from "zapier-platform-core";

import { createResource } from "../../types/resource";
import { OutputItem } from "../../types/operation";

export type BlockId = Parameters<providers.JsonRpcProvider["gasPrice"]>[0];

export interface GetGasPrice {
  blockId?: BlockId;
  networkUrl?: string;
}

export interface GasPriceResult extends OutputItem {
  gasPrice: string;
}

export async function performGet(
  z: ZObject,
  { inputData }: Bundle<GetGasPrice>
): Promise<GasPriceResult> {
  const rpc = new providers.JsonRpcProvider({
    url: inputData.networkUrl || "https://rpc.testnet.near.org",
  });

  z.console.log(
    `Getting gas price with input data: ${JSON.stringify(inputData)}`
  );

  const { gas_price: gasPrice } = await rpc.gasPrice(inputData.blockId || null);

  z.console.log(`Got gas price successfully`);

  return { id: new Date().toISOString(), gasPrice };
}

export default createResource<GasPriceResult>({
  key: "gas_price",
  noun: "Gas Price",

  get: {
    display: {
      label: "Gas Price",
      description: "Gets gas price by block ID.",
    },
    operation: {
      inputFields: [
        { key: "blockId", required: false },
        { key: "networkUrl", required: false },
      ],
      perform: performGet,
      sample: {
        id: new Date().toISOString(),
        gasPrice: "1",
      },
    },
  },
});
