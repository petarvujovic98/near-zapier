import { Field, FieldType } from "../../types";

/** A deposit input field */
export const DepositField: Field = {
  key: "deposit",
  label: "Deposit",
  helpText: "The amount of tokens to deposit (in NEAR).",
  type: FieldType.NUMBER,
  placeholder: "0.1",
};

/** An interface that includes the deposit. For use with Bundle object */
export interface WithDeposit {
  deposit: number;
}
