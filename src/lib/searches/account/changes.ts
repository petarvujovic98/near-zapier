import { providers } from "near-api-js";
import { ChangeResult } from "near-api-js/lib/providers/provider";
import { Bundle, ZObject } from "zapier-platform-core";

import { OutputItem, createSearch } from "../../../types";
import {
  NetworkSelectField,
  WithNetworkSelection,
  getNetwork,
  WithBlockIDOrFinality,
  BlockIDOrFinalityField,
  WithAccountIdArray,
  getBlockIDOrFinality,
  AccountIdArrayField,
} from "../../common";

export interface ViewAccountChangesInput
  extends WithNetworkSelection,
    WithAccountIdArray,
    WithBlockIDOrFinality {}

export interface ViewAccountChangesResult extends ChangeResult, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewAccountChangesInput>
): Promise<Array<ViewAccountChangesResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  z.console.log(
    `Getting account changes with input data: ${JSON.stringify(inputData)}`
  );

  const accountView = await rpc.accountChanges(
    inputData.accountIds,
    getBlockIDOrFinality(inputData)
  );

  z.console.log("Got account changes successfully");

  return [{ id: new Date().toISOString(), ...accountView }];
};

export default createSearch<ViewAccountChangesInput, ViewAccountChangesResult>({
  key: "viewAccountChanges",
  noun: "View Account Changes",
  display: {
    label: "View Account Changes",
    description:
      "Returns account changes from transactions in a given account.",
  },
  operation: {
    perform,
    inputFields: [
      NetworkSelectField,
      BlockIDOrFinalityField,
      AccountIdArrayField,
    ],
    sample: {
      id: "1",
      block_hash: "6xsfPSG89s6fCMShxxxQTP6D4ZHM9xkGCgubayTDRzAP",
      changes: [
        {
          cause: {
            type: "transaction_processing",
            tx_hash: "HLvxLKFM7gohFSqXPp5SpyydNEVpAno352qJJbnddsz3",
          },
          type: "account_update",
          change: {
            account_id: "your_account.testnet",
            amount: "499999959035075000000000000",
            locked: "0",
            code_hash: "11111111111111111111111111111111",
            storage_usage: 182,
            storage_paid_at: 0,
          },
        },
        {
          cause: {
            type: "receipt_processing",
            receipt_hash: "CPenN1dp4DNKnb9LiL5hkPmu1WiKLMuM7msDjEZwDmwa",
          },
          type: "account_update",
          change: {
            account_id: "your_account.testnet",
            amount: "499999959035075000000000000",
            locked: "0",
            code_hash: "11111111111111111111111111111111",
            storage_usage: 264,
            storage_paid_at: 0,
          },
        },
      ],
    },
  },
});
