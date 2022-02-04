import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import View, {
  ViewFunctionInput,
  ViewFunctionResult,
  perform as viewPerform,
} from "../../../lib/searches/contract/view-function";
import { PureFunctionTester } from "../../../types";

describe("view function", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<ViewFunctionInput, ViewFunctionResult>;

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
        methodName: "get_meme_list",
        arguments: {},
      },
    });

    expect(result).toBeDefined();
  });
});
