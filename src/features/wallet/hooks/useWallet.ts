import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletApi, ConnectWalletPayload, DepositPayload } from "../api/walletApi";
import { handleMutationError, triggerHapticIfAvailable } from "../../../shared/utils/errorHelper";
import { useToastStore } from "../../notifications/store/toastStore";

export function useWalletBalance(enabled = true) {
  return useQuery({
    queryKey: ["walletBalance"],
    queryFn: walletApi.getBalance,
    enabled: enabled,
    refetchInterval: 12000, // Sync wallet balance every 12s
  });
}

export function useConnectWallet() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: (payload: ConnectWalletPayload) => walletApi.connect(payload),
    onSuccess: (data) => {
      triggerHapticIfAvailable("success");
      addToast("TON Wallet successfully connected and verified!", "success");
      queryClient.invalidateQueries({ queryKey: ["authMe"] });
      queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
    },
    onError: (err) => {
      triggerHapticIfAvailable("error");
      handleMutationError(err);
    },
  });
}

export function useDepositPrizePool() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: (payload: DepositPayload) => walletApi.deposit(payload),
    onSuccess: (data) => {
      triggerHapticIfAvailable("success");
      addToast("Sprint is now ACTIVE! Your prize pool is secured and verified.", "success");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", data.event_id] });
      queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
    },
    onError: (err) => {
      triggerHapticIfAvailable("error");
      handleMutationError(err);
    },
  });
}
