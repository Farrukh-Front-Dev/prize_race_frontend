import { api } from "../../../shared/api/axios";
import { User } from "../../../shared/types";

export interface ConnectWalletPayload {
  wallet_address: string;
  signature: string;
  message: string;
}

export interface DepositPayload {
  event_id: number;
  tx_hash: string;
  amount: string; // TON representation as string
}

export interface DepositResponse {
  status: string;
  event_id: number;
  event_status: string;
  tx_hash: string;
}

export interface WalletBalanceResponse {
  wallet_address: string;
  balance_ton: string;
  currency: string;
}

export const walletApi = {
  connect: async (payload: ConnectWalletPayload): Promise<User> => {
    const res = await api.post<User>("/wallet/connect", payload);
    return res.data;
  },

  deposit: async (payload: DepositPayload): Promise<DepositResponse> => {
    const res = await api.post<DepositResponse>("/wallet/deposit", payload);
    return res.data;
  },

  getBalance: async (): Promise<WalletBalanceResponse> => {
    const res = await api.get<WalletBalanceResponse>("/wallet/balance");
    return res.data;
  },
};
