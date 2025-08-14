export interface WalletState {
  address: string;
  balance: string;
  network: string;
  isConnected: boolean;
}

export interface SignatureRequest {
  message: string;
  address: string;
  signatureType: 'EIP191' | 'EIP712';
}

export interface WebSocketMessage {
  type: 'WALLET_UPDATE' | 'TRANSACTION' | 'ERROR';
  payload: any;
}