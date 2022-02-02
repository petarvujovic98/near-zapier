import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import {
  ChunkDetailsInput,
  ChunkDetailsResponse,
  perform as chunkPerform,
} from "../../../lib/searches/chunk/details";
import { PureFunctionTester } from "../../../types";

describe("block", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<ChunkDetailsInput, ChunkDetailsResponse>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches.chunkDetails.operation.perform as typeof chunkPerform,
        input
      );
  });

  it("should fail for missing chunk hash", async () => {
    try {
      await perform({
        inputData: {
          chunkHash: "EBM2qg5cGr47EjMPtH88uvmXHDHqmWPzKaQadbWhdw22",
        },
      });

      expect(false).toBeTruthy();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should return chunk details for block ID and shard ID input", async () => {
    const [result] = await perform({
      inputData: { blockId: 80946664, shardId: 1 },
    });

    expect(result).toBeDefined();
  });
});
