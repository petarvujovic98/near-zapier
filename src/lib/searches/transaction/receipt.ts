import { providers } from "near-api-js";
import { TypedError } from "near-api-js/lib/providers";
import { Bundle, ZObject } from "zapier-platform-core";

import {
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
  OutputItem,
} from "../../../types";
import { Receipt } from "../../../types/receipt";
import {
  getNetwork,
  WithNetworkSelection,
  NetworkSelectField,
  WithReceiptID,
  ReceiptIDField,
} from "../../common";

export interface ReceiptInput extends WithNetworkSelection, WithReceiptID {}

export interface ReceiptResult extends Receipt, OutputItem {}

export async function perform(
  z: ZObject,
  { inputData }: Bundle<ReceiptInput>
): Promise<Array<ReceiptResult>> {
  const rpc = new providers.JsonRpcProvider({
    url: getNetwork(inputData),
  });

  z.console.log(
    `Getting receipt with input data: ${JSON.stringify(inputData)}`
  );

  try {
    const receipt = await rpc.sendJsonRpc<Receipt>("EXPERIMENTAL_receipt", {
      receipt_id: inputData.receiptId,
    });

    z.console.log(`Got receipt successfully`);

    return [{ id: new Date().toISOString(), ...receipt }];
  } catch (error: unknown) {
    z.console.error(`Error getting receipt: ${JSON.stringify(error)}`);

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

export default createSearch<ReceiptInput, ReceiptResult>({
  key: "receipt",
  noun: "Receipt by ID",

  display: {
    label: "Receipt by ID",
    description:
      "Fetches a receipt by it's ID (as is, without a status or execution outcome)",
  },

  operation: {
    inputFields: [NetworkSelectField, ReceiptIDField],
    perform,
    sample: {
      id: new Date().toISOString(),
      predecessor_id: "bohdan.testnet",
      receipt: {
        Action: {
          actions: [
            {
              Transfer: {
                deposit: "1000000000000000000000000",
              },
            },
          ],
          gas_price: "103000000",
          input_data_ids: [],
          output_data_receivers: [],
          signer_id: "bohdan.testnet",
          signer_public_key:
            "ed25519:DhC7rPNTBwWJtmVXs1U1SqJztkn9AWbj6jCmQtkrg3TA",
        },
      },
      receipt_id: "2EbembRPJhREPtmHCrGv3Xtdm3xoc5BMVYHm3b2kjvMY",
      receiver_id: "frol.testnet",
    },
  },
});
