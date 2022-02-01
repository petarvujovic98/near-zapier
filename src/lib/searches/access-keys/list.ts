import { providers } from "near-api-js";
import {
  FunctionCallPermissionView,
  QueryResponseKind,
} from "near-api-js/lib/providers/provider";
import { Bundle, ZObject } from "zapier-platform-core";

import { OutputItem, createSearch } from "../../../types";
import {
  AccessKeyField,
  AccountIdField,
  WithAccountId,
  NetworkSelectField,
  WithNetworkSelection,
  getNetwork,
  WithBlockIDOrFinality,
  getBlockIDOrFinalityForQuery,
} from "../../common";

export interface AccessKeyView {
  nonce: number;
  permission: "FullAccess" | FunctionCallPermissionView;
}

export interface AccessKeyInfoView {
  public_key: string;
  access_key: AccessKeyView;
}

export interface AccessKeyList extends QueryResponseKind {
  keys: AccessKeyInfoView[];
}

export interface ViewAccessKeyListInput
  extends WithNetworkSelection,
    WithAccountId,
    WithBlockIDOrFinality {}

export interface ViewAccessKeyListResult extends AccessKeyList, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewAccessKeyListInput>
): Promise<Array<ViewAccessKeyListResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  z.console.log(
    `Getting access key list with input data: ${JSON.stringify(inputData)}`
  );

  const accessKeyList = await rpc.query<AccessKeyList>({
    request_type: "view_access_key_list",
    account_id: inputData.accountId,
    ...getBlockIDOrFinalityForQuery(inputData),
  });

  z.console.log("Got access key list successfully");

  return [{ id: new Date().toISOString(), ...accessKeyList }];
};

export default createSearch<ViewAccessKeyListInput, ViewAccessKeyListResult>({
  key: "viewAccessKeyList",
  noun: "Access Key List",
  display: {
    label: "View Access Key List",
    description: "Returns all access keys for a given account.",
  },
  operation: {
    perform,
    inputFields: [NetworkSelectField, AccountIdField, AccessKeyField],
    sample: {
      id: "1",
      keys: [
        {
          public_key: "ed25519:2j6qujbkPFuTstQLLTxKZUw63D5Wu3SG79Gop5JQrNJY",
          access_key: {
            nonce: 17,
            permission: {
              FunctionCall: {
                allowance: "9999203942481156415000",
                receiver_id: "place.meta",
                method_names: [],
              },
            },
          },
        },
        {
          public_key: "ed25519:46etzhzZHN4NSQ8JEQtbHCX7sT8WByS3vmSEb3fbmSgf",
          access_key: {
            nonce: 2,
            permission: {
              FunctionCall: {
                allowance: "9999930655034196535000",
                receiver_id: "dev-1596616186817-8588944",
                method_names: [],
              },
            },
          },
        },
        {
          public_key: "ed25519:4F9TwuSqWwvoyu7JVZDsupPhC7oYbYNsisBV2yQvyXFn",
          access_key: {
            nonce: 0,
            permission: "FullAccess",
          },
        },
        {
          public_key: "ed25519:4bZqp6nm1btr92UfKbyADDzJ4oPK9JetHXqEYqbYZmkD",
          access_key: {
            nonce: 2,
            permission: "FullAccess",
          },
        },
        {
          public_key: "ed25519:6ZPzX7hS37jiU9dRxbV1Waf8HSyKKFypJbrnZXzNhqjs",
          access_key: {
            nonce: 2,
            permission: {
              FunctionCall: {
                allowance: "9999922083697042955000",
                receiver_id: "example.testnet",
                method_names: [],
              },
            },
          },
        },
        {
          public_key: "ed25519:81RKfuo7mBbsaviTmBsq18t6Eq4YLnSi3ye2CBLcKFUX",
          access_key: {
            nonce: 8,
            permission: "FullAccess",
          },
        },
        {
          public_key: "ed25519:B4W1oAYTcG8GxwKev8jQtsYWkGwGdqP24W7eZ6Fmpyzc",
          access_key: {
            nonce: 0,
            permission: {
              FunctionCall: {
                allowance: "10000000000000000000000",
                receiver_id: "dev-1594144238344",
                method_names: [],
              },
            },
          },
        },
        {
          public_key: "ed25519:BA3AZbACoEzAsxKeToFd36AVpPXFSNhSMW2R6UYeGRwM",
          access_key: {
            nonce: 0,
            permission: {
              FunctionCall: {
                allowance: "10000000000000000000000",
                receiver_id: "new-corgis",
                method_names: [],
              },
            },
          },
        },
        {
          public_key: "ed25519:BRyHUGAJjRKVTc9ZqXTTSJnFmSca8WLj8TuVe1wXK3LZ",
          access_key: {
            nonce: 17,
            permission: "FullAccess",
          },
        },
        {
          public_key: "ed25519:DjytaZ1HZ5ZFmH3YeJeMCiC886K1XPYeGsbz2E1AZj2J",
          access_key: {
            nonce: 31,
            permission: "FullAccess",
          },
        },
        {
          public_key: "ed25519:DqJn5UCq6vdNAvfhnbpdAeuui9a6Hv9DKYDxeRACPUDP",
          access_key: {
            nonce: 0,
            permission: "FullAccess",
          },
        },
        {
          public_key: "ed25519:FFxG8x6cDDyiErFtRsdw4dBNtCmCtap4tMTjuq3umvSq",
          access_key: {
            nonce: 0,
            permission: "FullAccess",
          },
        },
      ],
      block_height: 17798231,
      block_hash: "Gm7YSdx22wPuciW1jTTeRGP9mFqmon69ErFQvgcFyEEB",
    },
  },
});
