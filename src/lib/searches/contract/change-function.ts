import * as BN from "bn.js";
import { TypedError } from "near-api-js/lib/providers";
import { FinalExecutionOutcome } from "near-api-js/lib/providers/provider";
import { Primitive } from "type-fest";
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
  WithBlockIDOrFinality,
  BlockIDOrFinalityField,
  WithArguments,
  WithMethodName,
  MethodNameField,
  ArgumentsField,
  AccessKeyField,
  DepositField,
  WithDeposit,
  GasField,
  WithGas,
  setUpNEARWithPrivateKey,
  getYoctoNEAR,
  validateAccountID,
} from "../../common";
import MethodName from "../../triggers/contract/method-name";

export interface ChangeMethodOptions {
  args: Record<string, Primitive>;
  gas?: BN;
  amount?: BN;
  meta?: string;
  callbackUrl?: string;
}

export interface ChangeFunctionInput
  extends WithNetworkSelection,
    WithAccountId,
    WithArguments,
    WithMethodName,
    WithDeposit,
    WithGas,
    WithBlockIDOrFinality {
  privateKey: string;
  senderAccountId: string;
}

export interface ChangeFunctionResult
  extends FinalExecutionOutcome,
    OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ChangeFunctionInput>
): Promise<Array<ChangeFunctionResult>> => {
  if (!validateAccountID(inputData.senderAccountId)) {
    throw new z.errors.Error(
      "Invalid sender account ID",
      ErrorTypes.INVALID_DATA,
      ErrorTypeCodes.INVALID_DATA
    );
  }

  if (!validateAccountID(inputData.accountId)) {
    throw new z.errors.Error(
      "Invalid contract ID",
      ErrorTypes.INVALID_DATA,
      ErrorTypeCodes.INVALID_DATA
    );
  }

  if (inputData.gas && inputData.gas <= 0) {
    throw new z.errors.Error(
      "Invalid gas. Gas has to be greater than 0",
      ErrorTypes.INVALID_DATA,
      ErrorTypeCodes.INVALID_DATA
    );
  }

  if (inputData.deposit && inputData.deposit < 0) {
    throw new z.errors.Error(
      "Invalid deposit. Deposit has to be non negative",
      ErrorTypes.INVALID_DATA,
      ErrorTypeCodes.INVALID_DATA
    );
  }

  const { near, keyStore } = await setUpNEARWithPrivateKey(inputData);

  const account = await near.account(inputData.senderAccountId);

  const { privateKey: _, deposit: __, ...logData } = inputData;

  z.console.log(
    `Calling contract change function with input data: ${JSON.stringify(
      logData
    )}`
  );

  try {
    const result = await account.functionCall({
      methodName: inputData.methodName,
      args: inputData.arguments,
      attachedDeposit: getYoctoNEAR(inputData.deposit),
      contractId: inputData.accountId,
      ...(inputData.gas ? { gas: getYoctoNEAR(inputData.gas) } : {}),
    });

    z.console.log("Called contract change function successfully");

    await keyStore.clear();

    return [
      {
        id: new Date().toISOString(),
        ...result,
      },
    ];
  } catch (error: unknown) {
    z.console.error(
      `Error calling contract change function: ${JSON.stringify(error)}`
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
};

export default createSearch<ChangeFunctionInput, ChangeFunctionResult>({
  key: "callChangeFunction",
  noun: "Call a Contract Change Function",
  display: {
    label: "Call a Contract Change Function",
    description: "Allows you to call a contract method as a change function.",
    important: true,
  },
  operation: {
    perform,
    inputFields: [
      NetworkSelectField,
      BlockIDOrFinalityField,
      { ...AccountIdField, key: "senderAccountId", label: "Sender Account ID" },
      { ...AccessKeyField, key: "privateKey", label: "Private Key" },
      AccountIdField,
      { ...MethodNameField, dynamic: `${MethodName.key}.id.name` },
      ArgumentsField,
      DepositField,
      GasField,
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
