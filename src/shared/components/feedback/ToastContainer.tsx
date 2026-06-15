import { useToastStore, Toast } from "../../../features/notifications/store/toastStore";
import { AlertCircle, CheckCircle2, ChevronRight, Info, AlertTriangle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-[100] px-4 flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((toast) => {
        let bgClass = "bg-inverse-surface text-inverse-on-surface";
        let IconComponent = Info;
        let iconEmoji = "💡";

        if (toast.type === "success") {
          bgClass = "bg-[#2e3039] text-white shadow-xl";
          IconComponent = CheckCircle2;
          iconEmoji = "🎉";
        } else if (toast.type === "warning") {
          bgClass = "bg-amber-500 text-white shadow-md";
          IconComponent = AlertTriangle;
          iconEmoji = "⚠️";
        } else if (toast.type === "error") {
          bgClass = "bg-[#ba1a1a] text-white shadow-lg border border-white/10";
          IconComponent = AlertCircle;
          iconEmoji = "❌";
        } else if (toast.type === "info") {
          bgClass = "bg-blue-600 text-white shadow-md";
          IconComponent = Info;
          iconEmoji = "ℹ️";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all duration-300 transform scale-100 max-w-[340px] w-full ${bgClass}`}
          >
            <span className="shrink-0 flex items-center justify-center">
              {toast.type === "success" ? (
                <span className="text-lg">{iconEmoji}</span>
              ) : (
                <IconComponent className="w-5 h-5 text-current" />
              )}
            </span>
            
            <p className="font-label-md text-label-md flex-1 text-xs font-semibold leading-snug">
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-current opacity-70 hover:opacity-100 p-0.5 rounded-full transition-colors active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
export default ToastContainer;
