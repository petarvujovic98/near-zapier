import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import View, {
  ViewMethodsInput,
  ViewMethodsResult,
  perform as viewPerform,
} from "../../../lib/triggers/contract/method-name";
import { PureFunctionTester } from "../../../types";

describe("method name", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<ViewMethodsInput, ViewMethodsResult>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.triggers[View.key].operation.perform as typeof viewPerform,
        input
      );
  });

  it("should return contract method names", async () => {
    const result = await perform({
      inputData: {
        accountId: "museum.testnet",
      },
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
