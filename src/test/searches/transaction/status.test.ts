import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import Status, {
  TXStatusInput,
  TXStatusResult,
  perform as statusPerform,
} from "../../../lib/searches/transaction/status";
import { PureFunctionTester } from "../../../types";

describe("status", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<TXStatusInput, TXStatusResult>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches[Status.key].operation.perform as typeof statusPerform,
        input
      );
  });

  it("should throw error for old data", async () => {
    try {
      await perform({
        inputData: {
          txHash: "6zgh2u9DqHHiXzdy9ouTP7oGky2T4nugqzqt9wJZwNFm",
          accountId: "sender.testnet",
        },
      });

      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
