import AccessKeys from "./access-keys";
import Account from "./account";
import Blocks from "./block";
import Chunks from "./chunk";
import Gas from "./gas";
import Network from "./network";
import Protocol from "./protocol";
import Transaction from "./transaction";

export default {
  ...AccessKeys,
  ...Account,
  ...Blocks,
  ...Chunks,
  ...Gas,
  ...Network,
  ...Protocol,
  ...Transaction,
};
