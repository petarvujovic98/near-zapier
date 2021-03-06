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
import { NetworkInfo } from "../../../types/network-info";
import {
  getNetwork,
  WithNetworkSelection,
  NetworkSelectField,
} from "../../common";

export interface NetworkInfoResponse extends NetworkInfo, OutputItem {}

export async function perform(
  z: ZObject,
  { inputData }: Bundle<WithNetworkSelection>
): Promise<Array<NetworkInfoResponse>> {
  const rpc = new providers.JsonRpcProvider({
    url: getNetwork(inputData),
  });

  z.console.log(
    `Getting network info with input data: ${JSON.stringify(inputData)}`
  );

  try {
    const info = await rpc.sendJsonRpc<NetworkInfo>("network_info", {});

    z.console.log(`Got network info successfully`);

    return [{ id: new Date().toISOString(), ...info }];
  } catch (error: unknown) {
    z.console.error(`Error getting network info: ${JSON.stringify(error)}`);

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

export default createSearch<WithNetworkSelection, NetworkInfoResponse>({
  key: "networkInfo",
  noun: "Network Info",

  display: {
    label: "Network Info",
    description:
      "Returns the current state of node network connections (active peers, transmitted data, etc.)",
  },

  operation: {
    inputFields: [NetworkSelectField],
    perform,
    sample: {
      id: new Date().toISOString(),
      active_peers: [
        {
          id: "ed25519:GkDv7nSMS3xcqA45cpMvFmfV1o4fRF6zYo1JRR6mNqg5",
          addr: "35.193.24.121:24567",
          account_id: null,
        },
      ],
      num_active_peers: 34,
      peer_max_count: 40,
      sent_bytes_per_sec: 17754754,
      received_bytes_per_sec: 492116,
      known_producers: [
        {
          account_id: "node0",
          addr: null,
          peer_id: "ed25519:7PGseFbWxvYVgZ89K1uTJKYoKetWs7BJtbyXDzfbAcqX",
        },
      ],
    },
  },
});
