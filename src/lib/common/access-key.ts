import { Field } from "../../types";

/** An access key input field */
export const AccessKeyField: Field = {
  key: "accessKey",
  label: "Access Key",
  helpText: "The access key you want to use.",
  placeholder: "ed25519:H9k5eiU4xXS3M4z8HzKJSLaZdqGdGwBG49o7orNC4eZW",
  inputFormat: "ed25519:{{input}}",
};

/** An interface that includes the access key. For use with Bundle object */
export interface WithAccessKey {
  accessKey: string;
}
