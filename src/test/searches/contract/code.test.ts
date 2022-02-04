import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import View, {
  ViewContractCodeInput,
  ViewContractCodeResult,
  perform as viewPerform,
} from "../../../lib/searches/contract/code";
import { PureFunctionTester } from "../../../types";

describe("code", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<
    ViewContractCodeInput,
    ViewContractCodeResult
  >;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches[View.key].operation.perform as typeof viewPerform,
        input
      );
  });

  it("should return contract code", async () => {
    const [result] = await perform({
      inputData: {
        accountId: "museum.testnet",
      },
    });

    expect(result).toBeDefined();
  });
});
