import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import Receipt, {
  ReceiptInput,
  ReceiptResult,
  perform as receiptPerform,
} from "../../../lib/searches/transaction/receipt";
import { PureFunctionTester } from "../../../types";

describe("receipt", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<ReceiptInput, ReceiptResult>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches[Receipt.key].operation.perform as typeof receiptPerform,
        input
      );
  });

  it("should throw error for old data", async () => {
    try {
      await perform({
        inputData: {
          receiptId: "6zgh2u9DqHHiXzdy9ouTP7oGky2T4nugqzqt9wJZwNFm",
        },
      });

      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
