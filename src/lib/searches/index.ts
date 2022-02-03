import AccessKeys from "./access-keys";
import Blocks from "./block";
import Chunks from "./chunk";
import Gas from "./gas";

export default {
  ...AccessKeys,
  ...Blocks,
  ...Chunks,
  ...Gas,
};
