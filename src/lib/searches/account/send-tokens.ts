import { FinalExecutionOutcome } from "near-api-js/lib/providers/provider";
import { Bundle, ZObject } from "zapier-platform-core";

import { OutputItem, createSearch } from "../../../types";
import {
  AccountIdField,
  WithAccountId,
  NetworkSelectField,
  WithNetworkSelection,
  AccessKeyField,
  setUpNEARWithPrivateKey,
  getYoctoNEAR,
  WithAmount,
  AmountField,
} from "../../common";

export interface SendTokensInput
  extends WithNetworkSelection,
    WithAccountId,
    WithAmount {
  privateKey: string;
  senderAccountId: string;
}

export interface SendTokensResult extends FinalExecutionOutcome, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<SendTokensInput>
): Promise<Array<SendTokensResult>> => {
  const { near, keyStore } = await setUpNEARWithPrivateKey(inputData);

  const account = await near.account(inputData.senderAccountId);

  const { privateKey: _, amount: __, ...logData } = inputData;

  z.console.log(
    `Calling send tokens function with input data: ${JSON.stringify(logData)}`
  );

  const result = await account.sendMoney(
    inputData.accountId,
    getYoctoNEAR(inputData.amount)
  );

  z.console.log("Called send tokens function successfully");

  await keyStore.clear();

  return [
    {
      id: new Date().toISOString(),
      ...result,
    },
  ];
};

export default createSearch<SendTokensInput, SendTokensResult>({
  key: "sendTokens",
  noun: "Send Tokens",
  display: {
    label: "Send Tokens",
    description: "Allows you to send NEAR tokens to another account.",
  },
  operation: {
    perform,
    inputFields: [
      NetworkSelectField,
      { ...AccountIdField, key: "senderAccountId", label: "Sender Account ID" },
      { ...AccessKeyField, key: "privateKey", label: "Private Key" },
      AccountIdField,
      AmountField,
    ],
    sample: {
      id: "1",
      status: {
        SuccessValue: "",
      },
      transaction: {
        signer_id: "sender.testnet",
        public_key: "ed25519:Gowpa4kXNyTMRKgt5W7147pmcc2PxiFic8UHW9rsNvJ6",
        nonce: 13,
        receiver_id: "receiver.testnet",
        actions: [
          {
            Transfer: {
              deposit: "1000000000000000000000000",
            },
          },
        ],
        signature:
          "ed25519:7oCBMfSHrZkT7tzPDBxxCd3tWFhTES38eks3MCZMpYPJRfPWKxJsvmwQiVBBxRLoxPTnXVaMU2jPV3MdFKZTobH",
        hash: "ASS7oYwGiem9HaNwJe6vS2kznx2CxueKDvU9BAYJRjNR",
      },
      transaction_outcome: {
        // proof: [],
        // block_hash: "9MzuZrRPW1BGpFnZJUJg6SzCrixPpJDfjsNeUobRXsLe",
        id: "ASS7oYwGiem9HaNwJe6vS2kznx2CxueKDvU9BAYJRjNR",
        outcome: {
          logs: [],
          receipt_ids: ["BLV2q6p8DX7pVgXRtGtBkyUNrnqkNyU7iSksXG7BjVZh"],
          gas_burnt: 223182562500,
          // tokens_burnt: "22318256250000000000",
          // executor_id: "sender.testnet",
          status: {
            SuccessReceiptId: "BLV2q6p8DX7pVgXRtGtBkyUNrnqkNyU7iSksXG7BjVZh",
          },
        },
      },
      receipts_outcome: [
        {
          // proof: [],
          // block_hash: "5Hpj1PeCi32ZkNXgiD1DrW4wvW4Xtic74DJKfyJ9XL3a",
          id: "BLV2q6p8DX7pVgXRtGtBkyUNrnqkNyU7iSksXG7BjVZh",
          outcome: {
            logs: [],
            receipt_ids: ["3sawynPNP8UkeCviGqJGwiwEacfPyxDKRxsEWPpaUqtR"],
            gas_burnt: 223182562500,
            // tokens_burnt: "22318256250000000000",
            // executor_id: "receiver.testnet",
            status: {
              SuccessValue: "",
            },
          },
        },
        {
          // proof: [],
          // block_hash: "CbwEqMpPcu6KwqVpBM3Ry83k6M4H1FrJjES9kBXThcRd",
          id: "3sawynPNP8UkeCviGqJGwiwEacfPyxDKRxsEWPpaUqtR",
          outcome: {
            logs: [],
            receipt_ids: [],
            gas_burnt: 0,
            // tokens_burnt: "0",
            // executor_id: "sender.testnet",
            status: {
              SuccessValue: "",
            },
          },
        },
      ],
    },
  },
});
