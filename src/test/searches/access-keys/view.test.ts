import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import {
  ViewAccessKeyInput,
  ViewAccessKeyResult,
  perform as viewPerform,
} from "../../../lib/searches/access-keys/view";
import { PureFunctionTester } from "../../../types";

describe("view", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<ViewAccessKeyInput, ViewAccessKeyResult>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches.viewAccessKey.operation.perform as typeof viewPerform,
        input
      );
  });

  it("should return access key details", async () => {
    const [result] = await perform({
      inputData: {
        accessKey: "ed25519:H9k5eiU4xXS3M4z8HzKJSLaZdqGdGwBG49o7orNC4eZW",
        accountId: "client.chainlink.testnet",
      },
    });

    expect(result).toBeDefined();
  });
});
