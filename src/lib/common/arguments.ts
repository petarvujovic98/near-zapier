import { Primitive } from "type-fest";

import { Field } from "../../types";

/** An arguments input field */
export const ArgumentsField: Field = {
  key: "arguments",
  label: "Function Arguments",
  dict: true,
  helpText: "The arguments to pass to the function.",
};

export type Args = Record<string, Primitive>;

/** An interface that includes the arguments of a function. For use with Bundle object */
export interface WithArguments {
  arguments: Args;
}

/**
 * Encode a record of arguments into a base64 string.
 *
 * @param  {Args} args
 * @returns string
 */
export function encodeArguments(args: Args): string {
  return Buffer.from(JSON.stringify(args)).toString("base64");
}
