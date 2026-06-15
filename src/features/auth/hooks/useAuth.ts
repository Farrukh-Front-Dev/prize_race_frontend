import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { authApi, RegisterPayload } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { useTelegram } from "../../../shared/hooks/useTelegram";
import { handleMutationError } from "../../../shared/utils/errorHelper";

export function useAuth() {
  const queryClient = useQueryClient();
  const { user: tgUser } = useTelegram();
  const { user, setUser, setLoading, setError } = useAuthStore();

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: (err) => {
      setError("Registration failed.");
      handleMutationError(err);
    },
  });

  const getMeQuery = useQuery({
    queryKey: ["authMe"],
    queryFn: authApi.getMe,
    enabled: !!user,
  });

  const updateMeMutation = useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["authMe"] });
    },
    onError: (err) => {
      handleMutationError(err);
    },
  });

  // Automatically register / bootstrap user session based on Telegram container context
  useEffect(() => {
    if (!user && tgUser?.id && !registerMutation.isPending) {
      setLoading(true);
      const payload: RegisterPayload = {
        telegram_id: String(tgUser.id),
        username: tgUser.username || `user_${tgUser.id}`,
        first_name: tgUser.first_name || "Alex",
        last_name: tgUser.last_name || "Thompson",
      };
      
      registerMutation.mutate(payload);
    }
  }, [tgUser?.id, user, registerMutation.isPending]);

  return {
    user,
    isLoading: registerMutation.isPending || getMeQuery.isLoading,
    register: registerMutation.mutate,
    updateProfile: updateMeMutation.mutate,
    isUpdating: updateMeMutation.isPending,
    refetchUser: getMeQuery.refetch,
  };
}
