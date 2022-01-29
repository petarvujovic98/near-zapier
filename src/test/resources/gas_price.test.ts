import { createAppTester, tools } from "zapier-platform-core";

import App from "../..";
import { PureFunction } from "../../types/function";
import { GetGasPrice, GasPriceResult } from "../../lib/resources/gas_price";

describe("gas_price", () => {
  let appTester: ReturnType<typeof createAppTester>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
  });

  test("should return value with up to date timestamp", async () => {
    const before = new Date().getTime();

    const perform = App.resources.gas_price.get.operation
      .perform as PureFunction<GetGasPrice, { id: string; gas_price: string }>;

    const result = (await appTester(perform, {
      inputData: { block_id: "" },
    })) as GasPriceResult;

    const after = new Date().getTime();

    expect(result).toBeDefined();

    const { gas_price, id } = result;

    expect(typeof gas_price).toEqual("string");

    expect(new Date(id).getTime()).toBeGreaterThanOrEqual(before);
    expect(new Date(id).getTime()).toBeLessThanOrEqual(after);

    const result2 = (await appTester(perform, {
      inputData: {
        block_id: 80479688,
      },
    })) as GasPriceResult;

    expect(result2).toBeDefined();

    const { gas_price: gas_price2 } = result2;

    expect(typeof gas_price2).toEqual("string");
  });
});
