import { providers } from "near-api-js";
import { FinalExecutionOutcome, TypedError } from "near-api-js/lib/providers";
import { ZObject } from "zapier-platform-core";

import {
  Bundle,
  createSearch,
  ErrorTypeCodes,
  ErrorTypes,
  OutputItem,
} from "../../../types";
import { Receipt } from "../../../types/receipt";
import {
  getNetwork,
  BlockIDField,
  WithTXHash,
  WithAccountId,
  encodeToU8,
  AccountIdField,
} from "../../common";

import { TXHashField } from "./../../common/transaction";

export interface TXStatusWithReceiptsInput extends WithTXHash, WithAccountId {}

export interface TXStatusWithReceitpsResult
  extends FinalExecutionOutcome,
    OutputItem {
  receipts: Receipt[];
}

export interface TXStatusWithReceipts extends FinalExecutionOutcome {
  receipts: Receipt[];
}

export async function perform(
  z: ZObject,
  { inputData, authData }: Bundle<TXStatusWithReceiptsInput>
): Promise<Array<TXStatusWithReceitpsResult>> {
  const rpc = new providers.JsonRpcProvider({
    url: getNetwork(authData),
  });

  z.console.log(
    `Getting transaction status with receipts with input data: ${JSON.stringify(
      inputData
    )}`
  );

  try {
    const status = (await rpc.txStatusReceipts(
      encodeToU8(inputData.txHash),
      inputData.accountId
    )) as TXStatusWithReceipts;

    z.console.log(`Got transaction status with receipts successfully`);

    return [{ id: new Date().toISOString(), ...status }];
  } catch (error: unknown) {
    z.console.error(
      `Error getting transaction status with receipts: ${JSON.stringify(error)}`
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

export default createSearch<
  TXStatusWithReceiptsInput,
  TXStatusWithReceitpsResult
>({
  key: "txStatusReceipts",
  noun: "Transaction Status With Receipts",

  display: {
    label: "Transaction Status With Receipts",
    description:
      "Queries status of a transaction by hash, returning the final transaction result and details of all receipts.",
  },

  operation: {
    inputFields: [BlockIDField, TXHashField, AccountIdField],
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
      receipts: [
        {
          predecessor_id: "bowen",
          receipt: {
            Action: {
              actions: [
                {
                  FunctionCall: {
                    args: "eyJhbW91bnQiOiIxMDAwIiwicmVjZWl2ZXJfaWQiOiJib3dlbiJ9",
                    deposit: "0",
                    gas: 100000000000000,
                    method_name: "transfer",
                  },
                },
              ],
              gas_price: "186029458",
              input_data_ids: [],
              output_data_receivers: [],
              signer_id: "bowen",
              signer_public_key:
                "ed25519:2f9Zv5kuyuPM5DCyEP5pSqg58NQ8Ct9uSRerZXnCS9fK",
            },
          },
          receipt_id: "FXMVxdhSUZaZftbmPJWaoqhEB9GrKB2oqg9Wgvuyvom8",
          receiver_id: "evgeny.lockup.m0",
        },
        {
          predecessor_id: "evgeny.lockup.m0",
          receipt: {
            Action: {
              actions: [
                {
                  Transfer: {
                    deposit: "1000",
                  },
                },
              ],
              gas_price: "186029458",
              input_data_ids: [],
              output_data_receivers: [],
              signer_id: "bowen",
              signer_public_key:
                "ed25519:2f9Zv5kuyuPM5DCyEP5pSqg58NQ8Ct9uSRerZXnCS9fK",
            },
          },
          receipt_id: "3Ad7pUygUegMUWUb1rEazfjnTaHfptXCABqKQ6WNq6Wa",
          receiver_id: "bowen",
        },
        {
          predecessor_id: "system",
          receipt: {
            Action: {
              actions: [
                {
                  Transfer: {
                    deposit: "19200274886926125000",
                  },
                },
              ],
              gas_price: "0",
              input_data_ids: [],
              output_data_receivers: [],
              signer_id: "bowen",
              signer_public_key:
                "ed25519:2f9Zv5kuyuPM5DCyEP5pSqg58NQ8Ct9uSRerZXnCS9fK",
            },
          },
          receipt_id: "5DdQg9pfoJMX1q6bvhsjyyRihzA3sb9Uq5K1J7vK43Ze",
          receiver_id: "bowen",
        },
        {
          predecessor_id: "system",
          receipt: {
            Action: {
              actions: [
                {
                  Transfer: {
                    deposit: "18663792669276228632284",
                  },
                },
              ],
              gas_price: "0",
              input_data_ids: [],
              output_data_receivers: [],
              signer_id: "bowen",
              signer_public_key:
                "ed25519:2f9Zv5kuyuPM5DCyEP5pSqg58NQ8Ct9uSRerZXnCS9fK",
            },
          },
          receipt_id: "FDp8ovTf5uJYDFemW5op6ebjCT2n4CPExHYie3S1h4qp",
          receiver_id: "bowen",
        },
      ],
    },
  },
});
