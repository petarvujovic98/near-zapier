import { providers } from "near-api-js";
import { TypedError } from "near-api-js/lib/providers";
import { ZObject } from "zapier-platform-core";

import {
  Bundle,
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
  OutputItem,
} from "../../../types";
import { getNetwork, BlockIDField, WithBlockID } from "../../common";

export type GasPriceInput = Partial<WithBlockID>;

export interface GasPriceResult extends OutputItem {
  gasPrice: string;
}

export async function perform(
  z: ZObject,
  { inputData, authData }: Bundle<GasPriceInput>
): Promise<Array<GasPriceResult>> {
  const rpc = new providers.JsonRpcProvider({
    url: getNetwork(authData),
  });

  z.console.log(
    `Getting gas price with input data: ${JSON.stringify(inputData)}`
  );

  try {
    const { gas_price: gasPrice } = await rpc.gasPrice(
      inputData.blockId || null
    );

    z.console.log(`Got gas price successfully`);

    return [{ id: new Date().toISOString(), gasPrice }];
  } catch (error: unknown) {
    z.console.error(`Error getting gas price: ${JSON.stringify(error)}`);

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
    inputFields: [BlockIDField],
    perform,
    sample: {
      id: new Date().toISOString(),
      gasPrice: "1",
    },
  },
});
