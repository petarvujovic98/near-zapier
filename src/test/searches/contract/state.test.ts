import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import View, {
  ViewContractStateInput,
  ViewContractStateResult,
  perform as viewPerform,
} from "../../../lib/searches/contract/state";
import { PureFunctionTester } from "../../../types";

describe("state", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<
    ViewContractStateInput,
    ViewContractStateResult
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

  it("should return contract state", async () => {
    const [result] = await perform({
      inputData: {
        accountId: "museum.testnet",
      },
    });

    expect(result).toBeDefined();
  });
});
