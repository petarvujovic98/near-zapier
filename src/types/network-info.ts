export interface ActivePeer {
  id: string;
  addr: string;
  account_id?: string;
}

export interface KnownProducer {
  account_id: string;
  addr?: string;
  peer_id: string;
}

export interface NetworkInfo {
  active_peers: ActivePeer[];
  num_active_peers: number;
  peer_max_count: number;
  sent_bytes_per_sec: number;
  received_bytes_per_sec: number;
  known_producers: KnownProducer[];
}
