import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import WithReceipts, {
  TXStatusWithReceiptsInput,
  TXStatusWithReceitpsResult,
  perform as statusPerform,
} from "../../../lib/searches/transaction/with-receipts";
import { PureFunctionTester } from "../../../types";

describe("with receipts", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<
    TXStatusWithReceiptsInput,
    TXStatusWithReceitpsResult
  >;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches[WithReceipts.key].operation
          .perform as typeof statusPerform,
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
