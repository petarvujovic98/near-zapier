import AccessKeys from "./access-keys";
import Blocks from "./block";
import Chunks from "./chunk";
import Gas from "./gas";
import Network from "./network";
import Protocol from "./protocol";

export default {
  ...AccessKeys,
  ...Blocks,
  ...Chunks,
  ...Gas,
  ...Network,
  ...Protocol,
};
