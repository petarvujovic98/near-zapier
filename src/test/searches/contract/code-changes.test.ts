import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import Changes, {
  ViewContractCodeChangesInput,
  ViewContractCodeChangesResult,
  perform as changesPerform,
} from "../../../lib/searches/contract/code-changes";
import { PureFunctionTester } from "../../../types";

describe("code changes", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<
    ViewContractCodeChangesInput,
    ViewContractCodeChangesResult
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

  it("should return contract code changes", async () => {
    const [result] = await perform({
      inputData: {
        accountIds: ["museum.testnet"],
      },
    });

    expect(result).toBeDefined();
  });
});
