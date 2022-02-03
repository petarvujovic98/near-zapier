import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import {
  BlockChangesInput,
  BlockChangesResponse,
  perform as viewPerform,
} from "../../../lib/searches/block/changes";
import { PureFunctionTester } from "../../../types";

describe("changes", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<BlockChangesInput, BlockChangesResponse>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches.blockChanges.operation.perform as typeof viewPerform,
        input
      );
  });

  it("should return result", async () => {
    const [result] = await perform({
      inputData: {},
    });

    expect(result).toBeDefined();
  });
});
