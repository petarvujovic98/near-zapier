import { providers } from "near-api-js";
import { TypedError } from "near-api-js/lib/providers";
import { ContractCodeView } from "near-api-js/lib/providers/provider";
import { ZObject } from "zapier-platform-core";

import {
  Bundle,
  OutputItem,
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
} from "../../../types";
import {
  AccountIdField,
  WithAccountId,
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
  { inputData, authData }: Bundle<ViewContractCodeInput>
): Promise<Array<ViewContractCodeResult>> => {
  if (!validateAccountID(inputData.accountId)) {
    throw new z.errors.Error(
      "Invalid account ID",
      ErrorTypes.INVALID_DATA,
      ErrorTypeCodes.INVALID_DATA
    );
  }

  const rpc = new providers.JsonRpcProvider({ url: getNetwork(authData) });

  z.console.log(
    `Getting contract code with input data: ${JSON.stringify(inputData)}`
  );

  try {
    const code = await rpc.query<ContractCodeView>({
      request_type: "view_code",
      account_id: inputData.accountId,
      ...getBlockIDOrFinalityForQuery(inputData),
    });

    z.console.log("Got contract code successfully");

    return [{ id: new Date().toISOString(), ...code }];
  } catch (error: unknown) {
    z.console.error(`Error getting contract code: ${JSON.stringify(error)}`);

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
    inputFields: [BlockIDOrFinalityField, AccountIdField],
    sample: {
      id: "1",
      code_base64: "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
      hash: "7KoFshMQkdyo5iTx8P2LbLu9jQpxRn24d27FrKShNVXs",
      block_height: 17814234,
      block_hash: "GT1D8nweVQU1zyCUv399x8vDv2ogVq71w17MyR66hXBB",
    },
  },
});
