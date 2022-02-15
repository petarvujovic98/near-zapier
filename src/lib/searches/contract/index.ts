import Code from "./code";
import State from "./state";
import CodeChanges from "./code-changes";
import StateChanges from "./state-changes";
import ViewFunction from "./view-function";

export default {
  [Code.key]: Code,
  [State.key]: State,
  [CodeChanges.key]: CodeChanges,
  [StateChanges.key]: StateChanges,
  [ViewFunction.key]: ViewFunction,
};
