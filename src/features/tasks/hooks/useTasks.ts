import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi, CreateTaskPayload } from "../api/tasksApi";
import { handleMutationError, triggerHapticIfAvailable } from "../../../shared/utils/errorHelper";
import { useToastStore } from "../../notifications/store/toastStore";

export function useEventTasks(eventId: number | null) {
  return useQuery({
    queryKey: ["tasks", eventId],
    queryFn: () => (eventId ? tasksApi.getByEventId(eventId) : []),
    enabled: !!eventId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ eventId, payload }: { eventId: number; payload: CreateTaskPayload }) =>
      tasksApi.create(eventId, payload),
    onSuccess: (data) => {
      triggerHapticIfAvailable("success");
      addToast(`Task "${data.title}" successfully added!`, "success");
      queryClient.invalidateQueries({ queryKey: ["tasks", data.event_id] });
    },
    onError: (err) => {
      triggerHapticIfAvailable("error");
      handleMutationError(err);
    },
  });
}

export function useVerifyTask() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: (taskId: number) => tasksApi.verify(taskId),
    onSuccess: (data) => {
      triggerHapticIfAvailable("success");
      addToast("+XP Claimed! Verification completed successfully.", "success");
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      // Invalidate both verification states and current profile for balance update
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["authMe"] });
    },
    onError: (err) => {
      triggerHapticIfAvailable("error");
      handleMutationError(err);
    },
  });
}
