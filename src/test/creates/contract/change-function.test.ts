import { UnencryptedFileSystemKeyStore } from "near-api-js/lib/key_stores";
import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import Change, {
  ChangeFunctionInput,
  ChangeFunctionResult,
  perform as viewPerform,
} from "../../../lib/creates/contract/change-function";
import { PureFunctionTester } from "../../../types";

describe("change function", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<
    ChangeFunctionInput,
    ChangeFunctionResult,
    false
  >;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.creates[Change.key].operation.perform as typeof viewPerform,
        input
      );
  });

  it("should return transaction outcome", async () => {
    const keyStore = new UnencryptedFileSystemKeyStore(
      "/home/petar/.near-credentials"
    );

    const keyPair = await keyStore.getKey("testnet", "petarvujovic.testnet");

    const privateKey = keyPair.toString().substring("ed25519:".length);

    const result = await perform({
      inputData: {
        accountId: "museum.testnet",
        methodName: "add_myself_as_contributor",
        arguments: {},
        deposit: 0,
        gas: 0,
      },
      authData: {
        privateKey,
        accountId: "petarvujovic.testnet",
      },
    });

    expect(result).toBeDefined();
  });
});
