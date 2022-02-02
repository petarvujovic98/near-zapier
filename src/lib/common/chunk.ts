import { ChunkId } from "near-api-js/lib/providers/provider";

import { Field, FieldType } from "../../types";

import { BlockIDField, WithBlockID } from "./block";

/** A chunk hash input field */
export const ChunkHashField: Field = {
  key: "chunkHash",
  label: "Chunk hash",
  helpText: "The hash of the chunk.",
  type: FieldType.STRING,
  placeholder: "EBM2qg5cGr47EjMPtH88uvmXHDHqmWPzKaQadbWhdw22",
};

/** An interface that includes the chunk hash. For use with Bundle object */
export interface WithChunkHash {
  chunkHash: string;
}

/** A shard ID input field */
export const ShardIDField: Field = {
  key: "shardId",
  label: "Shard ID",
  helpText: "The ID of the shard.",
  type: FieldType.NUMBER,
  placeholder: "0",
};

/** An interface that includes the shard ID. For use with Bundle object */
export interface WithShardID {
  shardId: number;
}

/** An interface that includes the block and shard ID. For use with Bundle object */
export interface WithBlockIDShardID extends WithBlockID, WithShardID {}

/** A chunk ID input Field */
export const ChunkIDField: Field = {
  key: "chunkId",
  label: "Chunk ID",
  children: [BlockIDField, ShardIDField],
};

/** An interface that includes the chunk ID. For use with Bundle object */
export interface WithChunkID
  extends Partial<WithBlockIDShardID>,
    Partial<WithChunkHash> {}

/**
 * Get the chunk ID parameter from the object containing either a block ID and shard ID,
 * or chunk hash field.
 *
 * @param  {WithChunkID} inputData
 * @returns ChunkId
 */
export function getChunkID(inputData: WithChunkID): ChunkId {
  if (inputData.chunkHash) {
    return inputData.chunkHash;
  }

  return [inputData.blockId, +inputData.shardId];
}
