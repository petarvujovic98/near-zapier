import { Field, FieldType } from "../../types";

/** A gas input field */
export const GasField: Field = {
  key: "gas",
  label: "Gas",
  helpText: "The amount of gas to attach (in NEAR).",
  type: FieldType.NUMBER,
  placeholder: "0.1",
};

/** An interface that includes the gas. For use with Bundle object */
export interface WithGas {
  gas: number;
}
