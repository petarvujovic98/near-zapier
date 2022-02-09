import { providers } from "near-api-js";
import { ContractCodeView } from "near-api-js/lib/providers/provider";
import { Bundle, ZObject } from "zapier-platform-core";

import {
  OutputItem,
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
} from "../../../types";
import {
  AccountIdField,
  WithAccountId,
  NetworkSelectField,
  WithNetworkSelection,
  getNetwork,
  WithBlockIDOrFinality,
  getBlockIDOrFinalityForQuery,
  BlockIDOrFinalityField,
  validateAccountID,
} from "../../common";

export interface ViewContractCodeInput
  extends WithNetworkSelection,
    WithAccountId,
    WithBlockIDOrFinality {}

export interface ViewContractCodeResult extends ContractCodeView, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewContractCodeInput>
): Promise<Array<ViewContractCodeResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  if (!validateAccountID(inputData.accountId)) {
    throw new z.errors.Error(
      "Invalid account ID",
      ErrorTypes.INVALID_DATA,
      ErrorTypeCodes.INVALID_DATA
    );
  }

  z.console.log(
    `Getting contract code with input data: ${JSON.stringify(inputData)}`
  );

  const code = await rpc.query<ContractCodeView>({
    request_type: "view_code",
    account_id: inputData.accountId,
    ...getBlockIDOrFinalityForQuery(inputData),
  });

  z.console.log("Got contract code successfully");

  return [{ id: new Date().toISOString(), ...code }];
};

export default createSearch<ViewContractCodeInput, ViewContractCodeResult>({
  key: "viewContractCode",
  noun: "View Contract Code",
  display: {
    label: "View Contract Code",
    description:
      "Returns the contract code (Wasm binary) deployed to the account. Please note that the returned code will be encoded in base64.",
  },
  operation: {
    perform,
    inputFields: [NetworkSelectField, BlockIDOrFinalityField, AccountIdField],
    sample: {
      id: "1",
      code_base64: "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
      hash: "7KoFshMQkdyo5iTx8P2LbLu9jQpxRn24d27FrKShNVXs",
      block_height: 17814234,
      block_hash: "GT1D8nweVQU1zyCUv399x8vDv2ogVq71w17MyR66hXBB",
    },
  },
});
