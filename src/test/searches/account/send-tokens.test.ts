import { UnencryptedFileSystemKeyStore } from "near-api-js/lib/key_stores";
import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import Send, {
  SendTokensInput,
  SendTokensResult,
  perform as sendPerform,
} from "../../../lib/searches/account/send-tokens";
import { PureFunctionTester } from "../../../types";

describe("send tokens", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<SendTokensInput, SendTokensResult>;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches[Send.key].operation.perform as typeof sendPerform,
        input
      );
  });

  it("should return transaction outcome", async () => {
    const keyStore = new UnencryptedFileSystemKeyStore(
      "/home/petar/.near-credentials"
    );

    const keyPair = await keyStore.getKey(
      "testnet",
      "test.petarvujovic.testnet"
    );

    const privateKey = keyPair.toString().substring("ed25519:".length);

    const [result] = await perform({
      inputData: {
        accountId: "petarvujovic.testnet",
        privateKey,
        senderAccountId: "test.petarvujovic.testnet",
        amount: 1,
      },
    });

    expect(result).toBeDefined();
  });
});
