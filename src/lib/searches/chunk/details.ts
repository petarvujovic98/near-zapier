import { Bundle, ZObject } from "zapier-platform-core";
import { providers } from "near-api-js";
import { ChunkResult } from "near-api-js/lib/providers/provider";
import { TypedError } from "near-api-js/lib/providers";

import {
  ChunkIDField,
  getChunkID,
  getNetwork,
  WithChunkID,
  WithNetworkSelection,
  NetworkSelectField,
} from "../../common";
import {
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
  OutputItem,
} from "../../../types";

export interface ChunkDetailsInput extends WithChunkID, WithNetworkSelection {}

export interface ChunkDetailsResponse extends ChunkResult, OutputItem {}

export async function perform(
  z: ZObject,
  { inputData }: Bundle<ChunkDetailsInput>
): Promise<Array<ChunkDetailsResponse>> {
  if (!inputData.chunkHash && !inputData.blockId && !inputData.shardId) {
    throw new z.errors.Error(
      "Invalid chunk ID. Either provide a chunk hash or a block ID and a shard ID",
      ErrorTypes.INVALID_DATA,
      ErrorTypeCodes.INVALID_DATA
    );
  }

  z.console.log(
    `Getting chunk details with input data: ${JSON.stringify(inputData)}`
  );

  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  try {
    const blockDetails = await rpc.chunk(getChunkID(inputData));

    z.console.log("Got chunk details successfully");

    return [{ id: new Date().toISOString(), ...blockDetails }];
  } catch (error: unknown) {
    z.console.error(`Error getting chunk details: ${JSON.stringify(error)}`);

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

export default createSearch<ChunkDetailsInput, ChunkDetailsResponse>({
  key: "chunkDetails",
  noun: "Chunk Details",

  display: {
    label: "Chunk Details",
    description:
      "Returns details of a specific chunk. You can run a block details query to get a valid chunk hash.",
  },

  operation: {
    perform,
    inputFields: [NetworkSelectField, ChunkIDField],
    sample: {
      id: "1",
      // author: "bitcat.pool.f863973.m0",
      header: {
        chunk_hash: "EBM2qg5cGr47EjMPtH88uvmXHDHqmWPzKaQadbWhdw22",
        prev_block_hash: "2yUTTubrv1gJhTUVnHXh66JG3qxStBqySoN6wzRzgdVD",
        // outcome_root: "11111111111111111111111111111111",
        prev_state_root_hash: "HqWDq3f5HJuWnsTfwZS6jdAUqDjGFSTvjhb846vV27dx",
        encoded_merkle_root: "9zYue7drR1rhfzEEoc4WUXzaYRnRNihvRoGt1BgK7Lkk",
        encoded_length: 8,
        height_created: 17821130,
        height_included: 17821130,
        shard_id: 0,
        gas_used: 0,
        gas_limit: 1000000000000000,
        rent_paid: "0",
        validator_reward: "0",
        balance_burnt: "0",
        outgoing_receipts_root: "H4Rd6SGeEBTbxkitsCdzfu9xL9HtZ2eHoPCQXUeZ6bW4",
        tx_root: "11111111111111111111111111111111",
        validator_proposals: [],
        signature:
          "ed25519:4iPgpYAcPztAvnRHjfpegN37Rd8dTJKCjSd1gKAPLDaLcHUySJHjexMSSfC5iJVy28vqF9VB4psz13x2nt92cbR7",
        prev_state_num_parts: 0,
      },
      transactions: [],
      receipts: [],
    },
  },
});
