import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import { WithNetworkSelection } from "../../../lib/common";
import Info, {
  NetworkInfoResponse,
  perform as infoPerform,
} from "../../../lib/searches/network/info";
import { PureFunctionTester } from "../../../types";

describe("network info", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<WithNetworkSelection, NetworkInfoResponse>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches[Info.key].operation.perform as typeof infoPerform,
        input
      );
  });

  it("should return network info for empty input", async () => {
    const [result] = await perform({
      inputData: {},
    });

    expect(result).toBeDefined();
  });
});
