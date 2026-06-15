import { useToastStore } from "../../features/notifications/store/toastStore";
import { ApiError } from "../types";

export function handleMutationError(err: unknown) {
  const toastStore = useToastStore.getState();
  
  // Cast safety checking
  const apiErr = err as ApiError;
  if (apiErr && typeof apiErr.status === "number") {
    const status = apiErr.status;
    const detail = apiErr.detail || "An error occurred.";

    if (status === 400 || status === 409) {
      // already joined, wrong status, already completed
      toastStore.addToast(detail, "info");
    } else if (status === 403) {
      // anti fraud, not participant, not organizer etc
      toastStore.addToast(detail, "warning");
    } else if (status === 429) {
      // mutation in flight
      toastStore.addToast("Request in progress — please wait", "warning");
    } else if (status === 401) {
      toastStore.addToast("Authentication session expired — reloading.", "error");
    } else {
      toastStore.addToast(detail, "error");
    }
  } else {
    toastStore.addToast(
      err instanceof Error ? err.message : "An unexpected network error occurred.",
      "error"
    );
  }
}
export function triggerHapticIfAvailable(type: "light" | "medium" | "heavy" | "success" | "warning" | "error" = "light") {
  const tg = (window as any).Telegram?.WebApp;
  if (tg?.HapticFeedback) {
    if (type === "success" || type === "warning" || type === "error") {
      tg.HapticFeedback.notificationOccurred(type);
    } else {
      tg.HapticFeedback.impactOccurred(type);
    }
  }
}
