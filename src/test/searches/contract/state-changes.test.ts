import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import Changes, {
  ViewContractStateChangesInput,
  ViewContractStateChangesResult,
  perform as changesPerform,
} from "../../../lib/searches/contract/state-changes";
import { PureFunctionTester } from "../../../types";

describe("state changes", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<
    ViewContractStateChangesInput,
    ViewContractStateChangesResult
  >;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches[Changes.key].operation.perform as typeof changesPerform,
        input
      );
  });

  it("should return contract state changes", async () => {
    const [result] = await perform({
      inputData: {
        accountIds: ["museum.testnet"],
      },
    });

    expect(result).toBeDefined();
  });
});
