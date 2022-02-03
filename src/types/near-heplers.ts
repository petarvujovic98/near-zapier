export interface ActionReceiptCreationConfig {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface BaseCost {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface CostPerByte {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface DataReceiptCreationConfig {
  base_cost: BaseCost;
  cost_per_byte: CostPerByte;
}

export interface CreateAccountCost {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface DeployContractCost {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface DeployContractCostPerByte {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface FunctionCallCost {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface FunctionCallCostPerByte {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface TransferCost {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface StakeCost {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface FullAccessCost {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface FunctionCallCost2 {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface FunctionCallCostPerByte2 {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface AddKeyCost {
  full_access_cost: FullAccessCost;
  function_call_cost: FunctionCallCost2;
  function_call_cost_per_byte: FunctionCallCostPerByte2;
}

export interface DeleteKeyCost {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface DeleteAccountCost {
  send_sir: number;
  send_not_sir: number;
  execution: number;
}

export interface ActionCreationConfig {
  create_account_cost: CreateAccountCost;
  deploy_contract_cost: DeployContractCost;
  deploy_contract_cost_per_byte: DeployContractCostPerByte;
  function_call_cost: FunctionCallCost;
  function_call_cost_per_byte: FunctionCallCostPerByte;
  transfer_cost: TransferCost;
  stake_cost: StakeCost;
  add_key_cost: AddKeyCost;
  delete_key_cost: DeleteKeyCost;
  delete_account_cost: DeleteAccountCost;
}

export interface StorageUsageConfig {
  num_bytes_account: number;
  num_extra_bytes_record: number;
}

export interface TransactionCosts {
  action_receipt_creation_config: ActionReceiptCreationConfig;
  data_receipt_creation_config: DataReceiptCreationConfig;
  action_creation_config: ActionCreationConfig;
  storage_usage_config: StorageUsageConfig;
  burnt_gas_reward: number[];
  pessimistic_gas_price_inflation_ratio: number[];
}

export interface ExtCosts {
  base: number;
  contract_compile_base: number;
  contract_compile_bytes: number;
  read_memory_base: number;
  read_memory_byte: number;
  write_memory_base: number;
  write_memory_byte: number;
  read_register_base: number;
  read_register_byte: number;
  write_register_base: number;
  write_register_byte: number;
  utf8_decoding_base: number;
  utf8_decoding_byte: number;
  utf16_decoding_base: number;
  utf16_decoding_byte: number;
  sha256_base: number;
  sha256_byte: number;
  keccak256_base: number;
  keccak256_byte: number;
  keccak512_base: number;
  keccak512_byte: number;
  log_base: number;
  log_byte: number;
  storage_write_base: number;
  storage_write_key_byte: number;
  storage_write_value_byte: number;
  storage_write_evicted_byte: number;
  storage_read_base: number;
  storage_read_key_byte: number;
  storage_read_value_byte: number;
  storage_remove_base: number;
  storage_remove_key_byte: number;
  storage_remove_ret_value_byte: number;
  storage_has_key_base: number;
  storage_has_key_byte: number;
  storage_iter_create_prefix_base: number;
  storage_iter_create_prefix_byte: number;
  storage_iter_create_range_base: number;
  storage_iter_create_from_byte: number;
  storage_iter_create_to_byte: number;
  storage_iter_next_base: number;
  storage_iter_next_key_byte: number;
  storage_iter_next_value_byte: number;
  touching_trie_node: number;
  promise_and_base: number;
  promise_and_per_promise: number;
  promise_return: number;
  validator_stake_base: number;
  validator_total_stake_base: number;
}

export interface LimitConfig {
  max_gas_burnt: number;
  max_gas_burnt_view: number;
  max_stack_height: number;
  initial_memory_pages: number;
  max_memory_pages: number;
  registers_memory_limit: number;
  max_register_size: number;
  max_number_registers: number;
  max_number_logs: number;
  max_total_log_length: number;
  max_total_prepaid_gas: number;
  max_actions_per_receipt: number;
  max_number_bytes_method_names: number;
  max_length_method_name: number;
  max_arguments_length: number;
  max_length_returned_data: number;
  max_contract_size: number;
  max_length_storage_key: number;
  max_length_storage_value: number;
  max_promises_per_function_call_action: number;
  max_number_input_data_dependencies: number;
}

export interface WasmConfig {
  ext_costs: ExtCosts;
  grow_mem_cost: number;
  regular_op_cost: number;
  limit_config: LimitConfig;
}

export interface AccountCreationConfig {
  min_allowed_top_level_account_length: number;
  registrar_account_id: string;
}

export interface RuntimeConfig {
  storage_amount_per_byte: string;
  transaction_costs: TransactionCosts;
  wasm_config: WasmConfig;
  account_creation_config: AccountCreationConfig;
}

export interface Validator {
  account_id: string;
  public_key: string;
  amount: string;
}

export interface NearProtocolConfig {
  protocol_version: number;
  genesis_time: string;
  chain_id: string;
  genesis_height: number;
  num_block_producer_seats: number;
  num_block_producer_seats_per_shard: number[];
  avg_hidden_validator_seats_per_shard: number[];
  dynamic_resharding: boolean;
  protocol_upgrade_stake_threshold: number[];
  protocol_upgrade_num_epochs: number;
  epoch_length: number;
  gas_limit: number;
  min_gas_price: string;
  max_gas_price: string;
  block_producer_kickout_threshold: number;
  chunk_producer_kickout_threshold: number;
  online_min_threshold: number[];
  online_max_threshold: number[];
  gas_price_adjustment_rate: number[];
  runtime_config: RuntimeConfig;
  validators: Validator[];
  transaction_validity_period: number;
  protocol_reward_rate: number[];
  max_inflation_rate: number[];
  total_supply: string;
  num_blocks_per_year: number;
  protocol_treasury_account: string;
  fishermen_threshold: string;
  minimum_stake_divisor: number;
}
