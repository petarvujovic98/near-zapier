import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import {
  ProtocolConfigInput,
  ProtocolConfigResponse,
  perform as protocolPerform,
} from "../../../lib/searches/protocol/protocol";
import { PureFunctionTester } from "../../../types";

describe("protocol", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<ProtocolConfigInput, ProtocolConfigResponse>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches.protocolConfig.operation.perform as typeof protocolPerform,
        input
      );
  });

  it("should return protocol config for empty input", async () => {
    const [result] = await perform({
      inputData: {},
    });

    expect(result).toBeDefined();
  });
});
