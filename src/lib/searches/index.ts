import AccessKeys from "./access-keys";
import Blocks from "./block";
import Chunks from "./chunk";
import Gas from "./gas";
import Protocol from "./protocol";

export default {
  ...AccessKeys,
  ...Blocks,
  ...Chunks,
  ...Gas,
  ...Protocol,
};
