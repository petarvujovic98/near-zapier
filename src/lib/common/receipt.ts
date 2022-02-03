import { Field, FieldType } from "../../types";

/** A receipt ID input field */
export const ReceiptIDField: Field = {
  key: "txHash",
  label: "Transaction hash",
  helpText: "The hash of the transaction.",
  type: FieldType.STRING,
  placeholder: "6zgh2u9DqHHiXzdy9ouTP7oGky2T4nugqzqt9wJZwNFm",
};

/** An interface that includes the receipt ID. For use with Bundle object */
export interface WithReceiptID {
  receiptId: string;
}
