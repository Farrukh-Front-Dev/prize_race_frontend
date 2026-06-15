import { useToastStore } from "../../features/notifications/store/toastStore";
import { ApiError } from "../types";

export function handleMutationError(err: unknown) {
  const toastStore = useToastStore.getState();
  
  // Cast safety checking
  const apiErr = err as ApiError;
  const errMsg = err instanceof Error ? err.message : String(err);
  
  // Ignore 404 status codes and text messages containing 404 or connection failures
  if (
    (apiErr && apiErr.status === 404) || 
    errMsg.includes("404") || 
    errMsg.includes("status code 404")
  ) {
    return;
  }

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
    // Avoid showing transient network/404 messages as toasts in local/dev preview
    if (errMsg.includes("Network Error") || errMsg.includes("404")) {
      return;
    }
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
