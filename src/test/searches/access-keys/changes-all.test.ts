import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import {
  ViewAccessKeysChangesInput,
  ViewAccessKeysChangesResult,
  perform as viewPerform,
} from "../../../lib/searches/access-keys/changes-all";
import { PureFunctionTester } from "../../../types";

describe("changes-all", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<
    ViewAccessKeysChangesInput,
    ViewAccessKeysChangesResult
  >;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches.viewAccessKeyChangesAll.operation
          .perform as typeof viewPerform,
        input
      );
  });

  it("should return access keys' changes", async () => {
    const [result] = await perform({
      inputData: {
        accountIds: ["example-acct.testnet"],
      },
    });

    expect(result).toBeDefined();
  });
});
