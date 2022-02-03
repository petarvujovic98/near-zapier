import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import { WithNetworkSelection } from "../../../lib/common";
import Node, {
  NodeStatusResponse,
  perform as nodesPerform,
} from "../../../lib/searches/network/nodes";
import { PureFunctionTester } from "../../../types";

describe("node status", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<WithNetworkSelection, NodeStatusResponse>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches[Node.key].operation.perform as typeof nodesPerform,
        input
      );
  });

  it("should return node status for empty input", async () => {
    const [result] = await perform({
      inputData: {},
    });

    expect(result).toBeDefined();
  });
});
