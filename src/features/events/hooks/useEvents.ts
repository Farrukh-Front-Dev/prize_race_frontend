import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi, CreateEventPayload, UpdateEventPayload } from "../api/eventsApi";
import { EventStatus } from "../../../shared/types";
import { handleMutationError, triggerHapticIfAvailable } from "../../../shared/utils/errorHelper";
import { useToastStore } from "../../notifications/store/toastStore";

export function useEventsList(status?: EventStatus) {
  return useQuery({
    queryKey: ["events", status],
    queryFn: () => eventsApi.list({ status }),
    refetchInterval: 15000, // Refresh races list every 15s
  });
}

export function useEventDetails(id: number | null) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => (id ? eventsApi.getById(id) : null),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: eventsApi.create,
    onSuccess: (data) => {
      triggerHapticIfAvailable("success");
      addToast(`Draft sprint "${data.title}" successfully created!`, "success");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      triggerHapticIfAvailable("error");
      handleMutationError(err);
    },
  });
}

export function useLockEvent() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: eventsApi.lock,
    onSuccess: (data) => {
      triggerHapticIfAvailable("success");
      addToast(`Sprint locked! Proceeding to prize pool deposit.`, "success");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", data.id] });
    },
    onError: (err) => {
      triggerHapticIfAvailable("error");
      handleMutationError(err);
    },
  });
}

export function useJoinEvent() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: eventsApi.join,
    onSuccess: (data) => {
      triggerHapticIfAvailable("success");
      addToast("Joined! Check the leaderboard.", "success");
      queryClient.invalidateQueries({ queryKey: ["event", data.event_id] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard", data.event_id] });
    },
    onError: (err) => {
      triggerHapticIfAvailable("error");
      handleMutationError(err);
    },
  });
}

export function useFinishEvent() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: eventsApi.finish,
    onSuccess: (data) => {
      triggerHapticIfAvailable("success");
      addToast(`Sprint finished successfully! Prizes allocated.`, "success");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", data.id] });
    },
    onError: (err) => {
      triggerHapticIfAvailable("error");
      handleMutationError(err);
    },
  });
}

export function useEventLeaderboard(eventId: number | null) {
  return useQuery({
    queryKey: ["leaderboard", eventId],
    queryFn: () => (eventId ? eventsApi.getLeaderboard(eventId) : []),
    enabled: !!eventId,
    refetchInterval: 8000, // Dynamic updates every 8s
  });
}

export function useEventWinners(eventId: number | null) {
  return useQuery({
    queryKey: ["winners", eventId],
    queryFn: () => (eventId ? eventsApi.getWinners(eventId) : []),
    enabled: !!eventId,
  });
}
export default useEventsList;
