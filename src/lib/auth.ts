import { providers } from "near-api-js";
import { KeyPairEd25519 } from "near-api-js/lib/utils";
import { Bundle, ZObject } from "zapier-platform-core";
import { AccessKeyList } from "near-api-js/lib/providers/provider";
import { TypedError } from "near-api-js/lib/providers";

import {
  AuthenticationType,
  createAuth,
  ErrorTypeCodes,
  ErrorTypes,
} from "../types";

import {
  AccessKeyField,
  getBlockIDOrFinalityForQuery,
  getNetwork,
  NetworkSelectField,
  NetworkType,
  AccountIdField,
  validateAccountID,
} from "./common";

export const perform = async (
  z: ZObject,
  { authData }: Bundle
): Promise<{ [key: string]: string }> => {
  if (!validateAccountID(authData.accountId)) {
    throw new z.errors.Error(
      "Invalid account ID",
      ErrorTypes.INVALID_DATA,
      ErrorTypeCodes.INVALID_DATA
    );
  }

  const rpc = new providers.JsonRpcProvider({
    url: getNetwork(authData.network as NetworkType),
  });

  const publicKey = new KeyPairEd25519(authData.privateKey)
    .getPublicKey()
    .toString();

  const { privateKey: _, ...logData } = authData;

  z.console.log(
    `Verifying access key authentication with input data: ${JSON.stringify(
      logData
    )}`
  );

  try {
    const { keys } = await rpc.query<AccessKeyList>({
      request_type: "view_access_key_list",
      account_id: authData.accountId,
      ...getBlockIDOrFinalityForQuery({}),
    });

    const hasAccessKey = keys.some(
      ({ public_key }) => public_key === publicKey
    );

    if (!hasAccessKey) {
      throw new z.errors.Error(
        "Access key not valid",
        ErrorTypes.INVALID_DATA,
        ErrorTypeCodes.INVALID_DATA
      );
    }

    z.console.log("Verified access key successfully");

    return authData;
  } catch (error: unknown) {
    z.console.error(
      `Error authenticating access key: ${JSON.stringify(error)}`
    );

    if (error instanceof z.errors.Error) {
      throw error;
    }

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

export default createAuth({
  type: AuthenticationType.CUSTOM,
  test: perform,
  fields: [
    NetworkSelectField,
    {
      ...AccountIdField,
      required: true,
    },
    {
      ...AccessKeyField,
      key: "privateKey",
      label: "Private Key",
      required: true,
    },
  ],
});
