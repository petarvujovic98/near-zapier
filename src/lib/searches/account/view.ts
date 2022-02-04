import { providers } from "near-api-js";
import { AccountView } from "near-api-js/lib/providers/provider";
import { Bundle, ZObject } from "zapier-platform-core";

import { OutputItem, createSearch } from "../../../types";
import {
  AccountIdField,
  WithAccountId,
  NetworkSelectField,
  WithNetworkSelection,
  getNetwork,
  WithBlockIDOrFinality,
  getBlockIDOrFinalityForQuery,
  BlockIDOrFinalityField,
} from "../../common";

export interface ViewAccountInput
  extends WithNetworkSelection,
    WithAccountId,
    WithBlockIDOrFinality {}

export interface ViewAccountResult extends AccountView, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewAccountInput>
): Promise<Array<ViewAccountResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  z.console.log(
    `Getting account with input data: ${JSON.stringify(inputData)}`
  );

  const accountView = await rpc.query<AccountView>({
    request_type: "view_account",
    account_id: inputData.accountId,
    ...getBlockIDOrFinalityForQuery(inputData),
  });

  z.console.log("Got account successfully");

  return [{ id: new Date().toISOString(), ...accountView }];
};

export default createSearch<ViewAccountInput, ViewAccountResult>({
  key: "viewAccount",
  noun: "View Account",
  display: {
    label: "View Account",
    description: "Returns basic account information.",
  },
  operation: {
    perform,
    inputFields: [NetworkSelectField, BlockIDOrFinalityField, AccountIdField],
    sample: {
      id: "1",
      amount: "399992611103597728750000000",
      locked: "0",
      code_hash: "11111111111111111111111111111111",
      storage_usage: 642,
      storage_paid_at: 0,
      block_height: 17795474,
      block_hash: "9MjpcnwW3TSdzGweNfPbkx8M74q1XzUcT1PAN8G5bNDz",
    },
  },
});
