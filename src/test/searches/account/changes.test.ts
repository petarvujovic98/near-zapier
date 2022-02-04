import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import Changes, {
  ViewAccountChangesInput,
  ViewAccountChangesResult,
  perform as changesPerform,
} from "../../../lib/searches/account/changes";
import { PureFunctionTester } from "../../../types";

describe("changes", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<
    ViewAccountChangesInput,
    ViewAccountChangesResult
  >;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches[Changes.key].operation.perform as typeof changesPerform,
        input
      );
  });

  it("should return account changes", async () => {
    const [result] = await perform({
      inputData: {
        accountIds: ["petarvujovic.testnet"],
      },
    });

    expect(result).toBeDefined();
  });
});
