import { providers } from "near-api-js";
import { BlockId } from "near-api-js/lib/providers/provider";

import { getNetwork, NetworkType } from "./lib/common";

export async function getTestBlockId(
  network: NetworkType = NetworkType.TESTNET
): Promise<BlockId> {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(network) });

  const {
    header: { height },
  } = await rpc.block({ finality: "final" });

  return height;
}
