import { createAppTester, tools } from "zapier-platform-core";

import App from "../..";
import { PureFunction } from "../../types";
import { GetGasPrice, GasPriceResult } from "../../lib/resources/gas-price";

describe("gas_price", () => {
  let appTester: ReturnType<typeof createAppTester>;

  describe("get", () => {
    let perform: PureFunction<GetGasPrice, GasPriceResult>;

    beforeEach(() => {
      appTester = createAppTester(App);
      tools.env.inject();
      perform = App.resources.gas_price.get.operation.perform as PureFunction<
        GetGasPrice,
        GasPriceResult
      >;
    });

    test("should return value with up to date timestamp", async () => {
      const before = new Date().getTime();

      const result = (await appTester(perform, {
        inputData: {},
      })) as GasPriceResult;

      const after = new Date().getTime();

      expect(result).toBeDefined();

      const { gasPrice, id } = result;

      expect(typeof gasPrice).toEqual("string");

      const timestamp = new Date(id).getTime();

      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });

    test("should return value for given block ID", async () => {
      const result = (await appTester(perform, {
        inputData: {
          blockId: 80479688,
        },
      })) as GasPriceResult;

      expect(result).toBeDefined();

      const { gasPrice } = result;

      expect(typeof gasPrice).toEqual("string");
    });
  });
});
