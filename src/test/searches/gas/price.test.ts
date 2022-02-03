import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import {
  GasPriceInput,
  GasPriceResult,
  perform as gasPerform,
} from "../../../lib/searches/gas/price";
import { PureFunctionTester } from "../../../types";

describe("price", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<GasPriceInput, GasPriceResult>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches.gasPrice.operation.perform as typeof gasPerform,
        input
      );
  });

  it("should return gas price for empty block ID", async () => {
    const [result] = await perform({
      inputData: {},
    });

    expect(result).toBeDefined();
    expect(typeof result.gasPrice).toEqual("string");
  });
});
