import { Field, FieldType } from "../../types";

/** A method name input field */
export const MethodNameField: Field = {
  key: "methodName",
  label: "Method Name",
  type: FieldType.STRING,
  helpText: "The name of the function to call.",
  placeholder: "get_balance",
};

/** An interface that includes the method name. For use with Bundle object */
export interface WithMethodName {
  methodName: string;
}
