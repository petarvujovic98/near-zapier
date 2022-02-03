export interface FunctionCall {
  args: string;
  deposit: string;
  gas: number;
  method_name: string;
}

export interface Transfer {
  deposit: string;
}

export type Action2 = { FunctionCall: FunctionCall } | { Transfer: Transfer };

export interface Action {
  actions: Action2[];
  gas_price: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input_data_ids: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output_data_receivers: any[];
  signer_id: string;
  signer_public_key: string;
}

export interface Receipt2 {
  Action: Action;
}

export interface Receipt {
  predecessor_id: string;
  receipt: Receipt2;
  receipt_id: string;
  receiver_id: string;
}
