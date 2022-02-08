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

/** An amount input field */
export const AmountField: Field = {
  key: "amount",
  label: "Amount",
  helpText: "The amount of tokens to send (in NEAR).",
  type: FieldType.NUMBER,
  placeholder: "0.1",
};

/** An interface that includes the amount. For use with Bundle object */
export interface WithAmount {
  amount: number;
}
