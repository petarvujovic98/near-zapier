import { Bundle, ZObject } from "zapier-platform-core";

/** Source code like {source: "return 1 + 2"} which the system will wrap in
 * a function for you. */
export interface FunctionSource {
  /** JavaScript code for the function body. This must end with a return statement. */
  source: string;
  /** Function signature. Defaults to ['z', 'bundle'] if not specified. */
  args?: Array<string>;
}

/** A path to a file that might have content like
 * module.exports = (z, bundle) => [{id: 123}];. */
export interface FunctionRequire {
  require: string;
}

export interface PureFunction<Input, Output> {
  (z: ZObject, bundle: Bundle<Input>):
    | Output
    | Array<Output>
    | Promise<Output>
    | Promise<Array<Output>>;
}

/** Internal pointer to a function from the original source or the source code itself.
 * Encodes arity and if arguments is used in the body. Note - just write normal functions
 * and the system will encode the pointers for you. Or, provide {source: "return 1 + 2"}
 * and the system will wrap in a function for you. */
export type FunctionSchema<Input, Output> =
  | string
  | FunctionSource
  | FunctionRequire
  | PureFunction<Input, Output>;
