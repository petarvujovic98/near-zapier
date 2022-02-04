import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import View, {
  ViewAccountInput,
  ViewAccountResult,
  perform as viewPerform,
} from "../../../lib/searches/account/view";
import { PureFunctionTester } from "../../../types";

describe("view", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<ViewAccountInput, ViewAccountResult>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches[View.key].operation.perform as typeof viewPerform,
        input
      );
  });

  it("should return account details", async () => {
    const [result] = await perform({
      inputData: {
        accountId: "petarvujovic.testnet",
      },
    });

    expect(result).toBeDefined();
  });
});
