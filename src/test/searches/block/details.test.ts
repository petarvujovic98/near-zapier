import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import { Finality } from "../../../lib/common";
import {
  BlockDetailsInput,
  BlockDetailsResponse,
  perform as blockPerform,
} from "../../../lib/searches/block/details";
import { PureFunctionTester } from "../../../types";

describe("details", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<BlockDetailsInput, BlockDetailsResponse>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches.blockDetails.operation.perform as typeof blockPerform,
        input
      );
  });

  it("should return block details for finality input", async () => {
    const [result] = await perform({
      inputData: { finality: Finality.FINAL },
    });

    expect(result).toBeDefined();
  });

  it("should return block details for block ID input", async () => {
    const [result] = await perform({
      inputData: { blockId: 80996664 },
    });

    expect(result).toBeDefined();
  });

  it("should return block details for empty input", async () => {
    const [result] = await perform({
      inputData: {},
    });

    expect(result).toBeDefined();
  });
});
