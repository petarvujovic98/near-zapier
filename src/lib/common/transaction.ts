import { Field, FieldType } from "../../types";

/** A transaction hash input field */
export const TXHashField: Field = {
  key: "txHash",
  label: "Transaction hash",
  helpText: "The hash of the transaction.",
  type: FieldType.STRING,
  placeholder: "6zgh2u9DqHHiXzdy9ouTP7oGky2T4nugqzqt9wJZwNFm",
};

/** An interface that includes the transaction hash. For use with Bundle object */
export interface WithTXHash {
  txHash: string;
}
