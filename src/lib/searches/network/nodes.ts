import { providers } from "near-api-js";
import { TypedError } from "near-api-js/lib/providers";
import { NodeStatusResult } from "near-api-js/lib/providers/provider";
import { ZObject } from "zapier-platform-core";

import {
  Bundle,
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
  OutputItem,
} from "../../../types";
import {
  getNetwork,
  WithNetworkSelection,
  NetworkSelectField,
} from "../../common";

export interface NodeStatusResponse extends NodeStatusResult, OutputItem {}

export async function perform(
  z: ZObject,
  { inputData }: Bundle<WithNetworkSelection>
): Promise<Array<NodeStatusResponse>> {
  const rpc = new providers.JsonRpcProvider({
    url: getNetwork(inputData),
  });

  z.console.log(
    `Getting node status with input data: ${JSON.stringify(inputData)}`
  );

  try {
    const status = await rpc.status();

    z.console.log(`Got node status successfully`);

    return [{ id: new Date().toISOString(), ...status }];
  } catch (error: unknown) {
    z.console.error(`Error getting node status: ${JSON.stringify(error)}`);

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

export default createSearch<WithNetworkSelection, NodeStatusResponse>({
  key: "nodeStatus",
  noun: "Node Status",

  display: {
    label: "Node Status",
    description:
      "Returns general status of a given node (sync status, nearcore node version, protocol version, etc), and the current set of validators.",
  },

  operation: {
    inputFields: [NetworkSelectField],
    perform,
    sample: {
      id: new Date().toISOString(),
      version: {
        version: "1.14.0-rc.1",
        build: "effa3b7a-modified",
      },
      chain_id: "testnet",
      rpc_addr: "0.0.0.0:3030",
      validators: [
        "node3",
        "node0",
        "staked.pool.f863973.m0",
        "01node.pool.f863973.m0",
        "node2",
        "dokia.pool.f863973.m0",
        "node1",
        "lowfeevalidation.pool.f863973.m0",
        "sl1sub.pool.f863973.m0",
        "zainy.pool.f863973.m0",
        "chorus-one.pool.f863973.m0",
        "thepassivetrust.pool.f863973.m0",
      ],
      sync_info: {
        latest_block_hash: "44kieHwr7Gg5r72V3DgU7cpgV2aySkk5qbBCdvwens8T",
        latest_block_height: 17774278,
        latest_state_root: "3MD3fQqnm3JYa9UQgenEJsR6UHoWuHV4Tpr4hZY7QwfY",
        latest_block_time: "2020-09-27T23:59:38.008063088Z",
        syncing: false,
      },
    },
  },
});
