import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import {
  ViewAccessKeyListInput,
  ViewAccessKeyListResult,
  perform as viewPerform,
} from "../../../lib/searches/access-keys/list";
import { PureFunctionTester } from "../../../types";

describe("list", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<
    ViewAccessKeyListInput,
    ViewAccessKeyListResult
  >;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches.viewAccessKeyList.operation.perform as typeof viewPerform,
        input
      );
  });

  it("should return access key list", async () => {
    const [result] = await perform({
      inputData: {
        accountId: "client.chainlink.testnet",
      },
    });

    expect(result).toBeDefined();
  });
});
