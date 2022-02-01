import { providers } from "near-api-js";
import { ChangeResult } from "near-api-js/lib/providers/provider";
import { Bundle, ZObject } from "zapier-platform-core";

import { OutputItem, createSearch } from "../../../types";
import {
  NetworkSelectField,
  WithNetworkSelection,
  getNetwork,
  WithBlockIDOrFinality,
  getBlockIDOrFinality,
  getAccountIDPublicKeyPairs,
  WithAccountKeyArray,
  AccountKeyArrayField,
  BlockIDOrFinalityField,
} from "../../common";

export interface ViewAccessKeyChangesInput
  extends WithNetworkSelection,
    WithAccountKeyArray,
    WithBlockIDOrFinality {}

export interface ViewAccessKeyChangesResult extends ChangeResult, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewAccessKeyChangesInput>
): Promise<Array<ViewAccessKeyChangesResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  z.console.log(
    `Getting access key list with input data: ${JSON.stringify(inputData)}`
  );

  const accessKeyChanges = await rpc.singleAccessKeyChanges(
    getAccountIDPublicKeyPairs(inputData),
    getBlockIDOrFinality(inputData)
  );

  z.console.log("Got access key list successfully");

  return [{ id: new Date().toISOString(), ...accessKeyChanges }];
};

export default createSearch<
  ViewAccessKeyChangesInput,
  ViewAccessKeyChangesResult
>({
  key: "viewAccessKeyChangesSingle",
  noun: "Access Key Changes (Single)",
  display: {
    label: "View access key changes (single)",
    description:
      "Returns individual access key changes in a specific block. You can query multiple keys by passing an array of objects containing the account_id and public_key.",
  },
  operation: {
    perform,
    inputFields: [
      NetworkSelectField,
      AccountKeyArrayField,
      BlockIDOrFinalityField,
    ],
    sample: {
      id: "1",
      block_hash: "4kvqE1PsA6ic1LG7S5SqymSEhvjqGqumKjAxnVdNN3ZH",
      changes: [
        {
          cause: {
            type: "transaction_processing",
            tx_hash: "HshPyqddLxsganFxHHeH9LtkGekXDCuAt6axVgJLboXV",
          },
          type: "access_key_update",
          change: {
            account_id: "example-acct.testnet",
            public_key: "ed25519:25KEc7t7MQohAJ4EDThd2vkksKkwangnuJFzcoiXj9oM",
            access_key: {
              nonce: 1,
              permission: "FullAccess",
            },
          },
        },
      ],
    },
  },
});
