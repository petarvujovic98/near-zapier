import { createAppTester, tools } from "zapier-platform-core";

import App from "../..";
import { Finality } from "../../lib/common";
import { perform as blockPerform } from "../../lib/searches/block";

describe("block", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: typeof blockPerform;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = App.searches.block.operation.perform as typeof blockPerform;
  });

  it("should return block details for finality input", async () => {
    const [result] = await appTester(perform, {
      inputData: { finality: Finality.FINAL },
    });

    expect(result).toBeDefined();
  });

  it("should return block details for block ID input", async () => {
    const [result] = await appTester(perform, {
      inputData: { blockId: 80946664 },
    });

    expect(result).toBeDefined();
  });

  it("should return block details for empty input", async () => {
    const [result] = await appTester(perform, {
      inputData: {},
    });

    expect(result).toBeDefined();
  });
});
