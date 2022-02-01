import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import {
  ViewAccessKeyChangesInput,
  ViewAccessKeyChangesResult,
  perform as viewPerform,
} from "../../../lib/searches/access-keys/changes-single";
import { PureFunctionTester } from "../../../types";

describe("view", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<
    ViewAccessKeyChangesInput,
    ViewAccessKeyChangesResult
  >;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches.viewAccessKeyChangesSingle.operation
          .perform as typeof viewPerform,
        input
      );
  });

  it("should return access key details", async () => {
    const [result] = await perform({
      inputData: {
        accountKeyArray: [
          {
            accountId: "example-acct.testnet",
            accessKey: "ed25519:25KEc7t7MQohAJ4EDThd2vkksKkwangnuJFzcoiXj9oM",
          },
        ],
      },
    });

    expect(result).toBeDefined();
  });
});
