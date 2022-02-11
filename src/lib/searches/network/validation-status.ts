import { providers } from "near-api-js";
import { Bundle, ZObject } from "zapier-platform-core";
import { EpochValidatorInfo } from "near-api-js/lib/providers/provider";
import { TypedError } from "near-api-js/lib/providers";

import {
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
  OutputItem,
} from "../../../types";
import {
  getNetwork,
  WithNetworkSelection,
  NetworkSelectField,
  WithBlockID,
  BlockIDField,
} from "../../common";

export interface ValidationStatusInput
  extends WithNetworkSelection,
    Partial<WithBlockID> {}

export interface ValidationStatusResponse
  extends EpochValidatorInfo,
    OutputItem {}

export async function perform(
  z: ZObject,
  { inputData }: Bundle<ValidationStatusInput>
): Promise<Array<ValidationStatusResponse>> {
  const rpc = new providers.JsonRpcProvider({
    url: getNetwork(inputData),
  });

  z.console.log(
    `Getting validation status with input data: ${JSON.stringify(inputData)}`
  );

  try {
    const info = await rpc.validators(inputData.blockId || null);

    z.console.log(`Got validation status successfully`);

    return [{ id: new Date().toISOString(), ...info }];
  } catch (error: unknown) {
    z.console.error(
      `Error getting validation status: ${JSON.stringify(error)}`
    );

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

export default createSearch<WithNetworkSelection, ValidationStatusResponse>({
  key: "validationStatus",
  noun: "Validation Status",

  display: {
    label: "Validation Status",
    description:
      "Queries active validators on the network returning details and the state of validation on the blockchain.",
  },

  operation: {
    inputFields: [NetworkSelectField, BlockIDField],
    perform,
    sample: {
      id: new Date().toISOString(),
      current_validators: [
        {
          account_id: "01node.pool.f863973.m0",
          public_key: "ed25519:3iNqnvBgxJPXCxu6hNdvJso1PEAc1miAD35KQMBCA3aL",
          is_slashed: false,
          stake: "176429739989396285019500901780",
          shards: [0],
          num_produced_blocks: 213,
          num_expected_blocks: 213,
        },
        {
          account_id: "zpool.pool.f863973.m0",
          public_key: "ed25519:ETFRFNHfvd6fpj74MGYYQp3diY8WB4bFmWMxjTB2yY4V",
          is_slashed: false,
          stake: "140932616764414290525265048028",
          shards: [0],
          num_produced_blocks: 120,
          num_expected_blocks: 212,
        },
      ],
      next_validators: [
        {
          account_id: "01node.pool.f863973.m0",
          public_key: "ed25519:3iNqnvBgxJPXCxu6hNdvJso1PEAc1miAD35KQMBCA3aL",
          stake: "177341160716540400974121040893",
          shards: [0],
        },
        {
          account_id: "alexandruast.pool.f863973.m0",
          public_key: "ed25519:A3XJ3uVGxSi9o2gnG2r8Ra3fqqodRpL4iuLTc6fNdGUj",
          stake: "152212670433756011274558210225",
          shards: [0],
        },
      ],
      current_fisherman: [
        {
          account_id: "staked.stakingpool",
          public_key: "ed25519:5VmCXxWepj22uFoKmrxk6DTiFa3fuTzDcwGxM8uUErpr",
          stake: "5957256918881889179239884296",
        },
        {
          account_id: "bisontrails.stakingpool",
          public_key: "ed25519:ED2v5KtScbk6aNjGcTn1YMDUu3EXfD5HPt1x6RiYBypk",
          stake: "7679439354334034871130713908",
        },
      ],
      next_fisherman: [
        {
          account_id: "staked.stakingpool",
          public_key: "ed25519:5VmCXxWepj22uFoKmrxk6DTiFa3fuTzDcwGxM8uUErpr",
          stake: "5957256918881889179239884296",
        },
        {
          account_id: "bisontrails.stakingpool",
          public_key: "ed25519:ED2v5KtScbk6aNjGcTn1YMDUu3EXfD5HPt1x6RiYBypk",
          stake: "7679439354334034871130713908",
        },
      ],
      current_proposals: [
        {
          account_id: "kytzu.pool.f863973.m0",
          public_key: "ed25519:61tgPZpy8tqFeAwG4vtf2ZKCRoENiP2A1TJVWEwnbxZU",
          stake: "114346100195275968419224582943",
        },
        {
          account_id: "nodeasy.pool.f863973.m0",
          public_key: "ed25519:25Dhg8NBvQhsVTuugav3t1To1X1zKiomDmnh8yN9hHMb",
          stake: "132333066144809013154670461579",
        },
        {
          account_id: "thepassivetrust.pool.f863973.m0",
          public_key: "ed25519:4NccD2DNJpBkDmWeJ2GbqPoivQ93qcKiR4PHALJKCTod",
          stake: "163554672455685458970920218837",
        },
      ],
      prev_epoch_kickout: [],
      epoch_start_height: 17754191,
      // epoch_height: 321,
    },
  },
});
