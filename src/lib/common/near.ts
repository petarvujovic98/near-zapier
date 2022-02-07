import BN = require("bn.js");
import { connect, Near } from "near-api-js";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";
import { KeyPairEd25519 } from "near-api-js/lib/utils";
import { parseNearAmount } from "near-api-js/lib/utils/format";

import { getNetwork, WithNetworkSelection } from "./network";

import { NetworkType } from ".";

/** An interface that represents the parameters needed to set up a NEAR connection */
export interface Config extends WithNetworkSelection {
  senderAccountId: string;
  privateKey: string;
}

/**
 * Set up a NEAR connection with an InMemoryKeyStore, given the private key, account ID and network.
 *
 * @param  {Config} config
 * @returns Promise
 */
export async function setUpNEARWithPrivateKey(
  config: Config
): Promise<{ near: Near; keyStore: InMemoryKeyStore }> {
  const keyPair = new KeyPairEd25519(config.privateKey);

  const keyStore = new InMemoryKeyStore();

  keyStore.setKey(
    config.network || NetworkType.TESTNET,
    config.senderAccountId,
    keyPair
  );

  const near = await connect({
    nodeUrl: getNetwork(config),
    headers: {},
    networkId: config.network || NetworkType.TESTNET,
    keyStore,
  });

  return { near, keyStore };
}

/**
 * A helper function that wraps the parseNearAmount function with a new BN instance.
 *
 * @param  {number|string} amount
 * @returns BN
 */
export function getYoctoNEAR(amount: number | string): BN {
  return new BN(parseNearAmount(`${amount}`));
}
