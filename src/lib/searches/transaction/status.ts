import { providers } from "near-api-js";
import { FinalExecutionOutcome } from "near-api-js/lib/providers";
import { Bundle, ZObject } from "zapier-platform-core";

import { createSearch, OutputItem } from "../../../types";
import {
  getNetwork,
  WithNetworkSelection,
  NetworkSelectField,
  BlockIDField,
  WithTXHash,
  WithAccountId,
} from "../../common";

export interface TXStatusInput
  extends WithNetworkSelection,
    WithTXHash,
    WithAccountId {}

export interface TXStatusResult extends FinalExecutionOutcome, OutputItem {}

export async function perform(
  z: ZObject,
  { inputData }: Bundle<TXStatusInput>
): Promise<Array<TXStatusResult>> {
  const rpc = new providers.JsonRpcProvider({
    url: getNetwork(inputData),
  });

  z.console.log(
    `Getting transaction status with input data: ${JSON.stringify(inputData)}`
  );

  const status = await rpc.txStatus(inputData.txHash, inputData.accountId);

  z.console.log(`Got transaction status successfully`);

  return [{ id: new Date().toISOString(), ...status }];
}

export default createSearch<TXStatusInput, TXStatusResult>({
  key: "txStatus",
  noun: "Transaction Status",

  display: {
    label: "Transaction Status",
    description:
      "Queries status of a transaction by hash and returns the final transaction result.",
  },

  operation: {
    inputFields: [NetworkSelectField, BlockIDField],
    perform,
    sample: {
      id: new Date().toISOString(),
      status: {
        SuccessValue: "",
      },
      transaction: {
        signer_id: "sender.testnet",
        public_key: "ed25519:Gowpa4kXNyTMRKgt5W7147pmcc2PxiFic8UHW9rsNvJ6",
        nonce: 15,
        receiver_id: "receiver.testnet",
        actions: [
          {
            Transfer: {
              deposit: "1000000000000000000000000",
            },
          },
        ],
        signature:
          "ed25519:3168QMdTpcwHvM1dmMYBc8hg9J3Wn8n7MWBSE9WrEpns6P5CaY87RM6k4uzyBkQuML38CZhU18HzmQEevPG1zCvk",
        hash: "6zgh2u9DqHHiXzdy9ouTP7oGky2T4nugqzqt9wJZwNFm",
      },
      transaction_outcome: {
        id: "6zgh2u9DqHHiXzdy9ouTP7oGky2T4nugqzqt9wJZwNFm",
        outcome: {
          logs: [],
          receipt_ids: ["3dMfwczW5GQqXbD9GMTnmf8jy5uACxG6FC5dWxm3KcXT"],
          gas_burnt: 223182562500,

          status: {
            SuccessReceiptId: "3dMfwczW5GQqXbD9GMTnmf8jy5uACxG6FC5dWxm3KcXT",
          },
        },
      },
      receipts_outcome: [
        {
          id: "3dMfwczW5GQqXbD9GMTnmf8jy5uACxG6FC5dWxm3KcXT",
          outcome: {
            logs: [],
            receipt_ids: ["46KYgN8ddxs4Qy8C7BDQH49XUfcYZsaQmAvdU1nfcL9V"],
            gas_burnt: 223182562500,

            status: {
              SuccessValue: "",
            },
          },
        },
        {
          id: "46KYgN8ddxs4Qy8C7BDQH49XUfcYZsaQmAvdU1nfcL9V",
          outcome: {
            logs: [],
            receipt_ids: [],
            gas_burnt: 0,

            status: {
              SuccessValue: "",
            },
          },
        },
      ],
    },
  },
});
