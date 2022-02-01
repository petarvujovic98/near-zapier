import Block from "./block";
import AccessKeys from "./access-keys";

export default {
  [Block.key]: Block,
  ...AccessKeys,
};
