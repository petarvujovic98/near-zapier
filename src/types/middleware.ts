import { FunctionSchema } from "./function";

/** List of before or after middlewares. Can be an array of functions or a single function */
export type Middlewares =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Array<FunctionSchema<any, any>> | FunctionSchema<any, any>;
