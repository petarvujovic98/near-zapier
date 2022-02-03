import { createAppTester, tools } from "zapier-platform-core";

import App from "../../..";
import ValidationStatus, {
  ValidationStatusInput,
  ValidationStatusResponse,
  perform as validationPerform,
} from "../../../lib/searches/network/validation-status";
import { PureFunctionTester } from "../../../types";

describe("validation status", () => {
  let appTester: ReturnType<typeof createAppTester>;
  let perform: PureFunctionTester<
    ValidationStatusInput,
    ValidationStatusResponse
  >;

  beforeEach(() => {
    appTester = createAppTester(App);
    tools.env.inject();
    perform = (input) =>
      appTester(
        App.searches[ValidationStatus.key].operation
          .perform as typeof validationPerform,
        input
      );
  });

  it("should return validation status for empty block ID", async () => {
    const [result] = await perform({
      inputData: {},
    });

    expect(result).toBeDefined();
  });
});
