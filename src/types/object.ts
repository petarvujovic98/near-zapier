import { Primitive } from "type-fest";

export interface FlatObject {
  [key: string]: Primitive | null;
}
