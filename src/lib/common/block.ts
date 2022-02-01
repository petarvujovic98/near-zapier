import { Field } from "../../types";

/** A block ID input field */
export const BlockIDField: Field = {
  key: "blockId",
  label: "Block ID",
  helpText: "The ID of the block. Can be a block hash or a block height.",
  placeholder: "80479688",
};

/** An interface that includes the block ID. For use with Bundle object */
export interface WithBlockID {
  blockId: string | number;
}

/** An interface that represents how the NEAR API excepts the block ID */
export interface BlockIdParam {
  block_id: string | number;
}

export enum Finality {
  FINAL = "final",
  OPTIMISTIC = "optimistic",
}

/** A finality input field */
export const FinalityField: Field = {
  key: "finality",
  label: "Finality",
  helpText:
    "The latest block. Optimistic for the latest block on the responder node. Final for the latest block validated on at least 66% of nodes.",
  placeholder: Finality.FINAL,
  default: Finality.FINAL,
  choices: [
    {
      label: "Final",
      value: Finality.FINAL,
      sample: Finality.FINAL,
    },
    {
      label: "Optimistic",
      value: Finality.OPTIMISTIC,
      sample: Finality.OPTIMISTIC,
    },
  ],
};

/** An interface that includes the finality. For use with Bundle object */
export interface WithFinality {
  finality: Finality;
}

export enum BlockIDOrFinality {
  BLOCK_ID = "blockId",
  FINALITY = "finality",
}

/** A block ID or finality field */
export const BlockIDOrFinalityField: Field = {
  key: "blockIdOrFinality",
  label: "Block ID or Finality",
  children: [BlockIDField, FinalityField],
};

/** An interface that includes either a block ID or finality */
export interface WithBlockIDOrFinality
  extends Partial<WithBlockID>,
    Partial<WithFinality> {}

/**
 * Get block ID or finality from object containing either a block ID or finality field.
 * If none, return finality with value final.
 *
 * @param  {WithBlockIDOrFinality} params
 * @returns WithBlockID | WithFinality
 */
export function getBlockIDOrFinality<
  Parameter extends WithBlockIDOrFinality = WithBlockIDOrFinality
>(params: Parameter): WithBlockID | WithFinality {
  if (params.blockId) {
    return { blockId: params.blockId };
  }

  if (params.finality) {
    return { finality: params.finality };
  }

  return { finality: Finality.FINAL };
}

/**
 * Get block ID or finality from object containing either a block ID or finality field.
 * If none, return finality with value final.
 * Note: This version is used for calling query methods.
 *
 * @param  {Parameter} params
 * @returns WithFinality | WithBlockID
 */
export function getBlockIDOrFinalityForQuery<
  Parameter extends WithBlockIDOrFinality = WithBlockIDOrFinality
>(params: Parameter): WithFinality | BlockIdParam {
  if (params.blockId) {
    return { block_id: params.blockId };
  }

  if (params.finality) {
    return { finality: params.finality };
  }

  return { finality: Finality.FINAL };
}
