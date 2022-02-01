import { Field } from "../../types";

export enum NetworkType {
  MAINNET = "mainnet",
  TESTNET = "testnet",
  BETANET = "betanet",
}

/** A network selection field */
export const NetworkSelectField: Field = {
  key: "network",
  label: "Network",
  helpText: "Select the network to send request to.",
  placeholder: NetworkType.TESTNET,
  default: NetworkType.TESTNET,
  choices: [
    {
      label: "Mainnet",
      value: NetworkType.MAINNET,
      sample: NetworkType.MAINNET,
    },
    {
      label: "Testnet",
      value: NetworkType.TESTNET,
      sample: NetworkType.TESTNET,
    },
    {
      label: "Betanet",
      value: NetworkType.BETANET,
      sample: NetworkType.BETANET,
    },
  ],
};

/** An interface that includes the network parameter. For use with Bundle object */
export interface WithNetworkSelection {
  network?: NetworkType;
}

/**
 * Get network URL for object which contains a network selection field.
 *
 * @param  {{network:NetworkType}} {network}
 * @returns string
 */
export function getNetwork({ network }: { network?: NetworkType }): string;
/**
 * Get network URL for a network selection field.
 *
 * @param  {NetworkType} network
 * @returns string
 */
export function getNetwork(network: NetworkType): string;
/**
 * Get network URL for a network selection.
 *
 * @param  {NetworkType|{network:NetworkType}} param
 * @returns string
 */
export function getNetwork(
  param: NetworkType | { network?: NetworkType }
): string {
  const network = typeof param === "object" ? param.network : param;

  switch (network) {
    case NetworkType.MAINNET:
    case NetworkType.TESTNET:
    case NetworkType.BETANET:
      return `https://rpc.${network}.near.org`;
    default:
      return "https://rpc.testnet.near.org";
  }
}
