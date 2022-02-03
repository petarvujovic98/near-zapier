import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import { WithNetworkSelection } from "../../../lib/common";
import {
  GenesisConfigResult,
  perform as genesisPerform,
} from "../../../lib/searches/protocol/genesis";
import { PureFunctionTester } from "../../../types";

describe("genesis", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<WithNetworkSelection, GenesisConfigResult>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches.genesisConfig.operation.perform as typeof genesisPerform,
        input
      );
  });

  it("should return genesis config", async () => {
    const [result] = await perform({
      inputData: {},
    });

    expect(result).toBeDefined();
  });
});
