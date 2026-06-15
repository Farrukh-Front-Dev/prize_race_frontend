import { useEffect, useState } from "react";

const DEFAULT_TG_USER = {
  id: 82910,
  first_name: "Alex",
  last_name: "Thompson",
  username: "alex_thompson",
};

export function useTelegram() {
  const [tg, setTg] = useState<any>(null);

  useEffect(() => {
    const telegramApp = (window as any).Telegram?.WebApp;
    if (telegramApp) {
      telegramApp.ready();
      telegramApp.expand();
      setTg(telegramApp);
    }
  }, []);

  const triggerHaptic = (type: "light" | "medium" | "heavy" | "success" | "warning" | "error" = "light") => {
    if (tg?.HapticFeedback) {
      if (type === "success" || type === "warning" || type === "error") {
        tg.HapticFeedback.notificationOccurred(type);
      } else {
        tg.HapticFeedback.impactOccurred(type);
      }
    }
  };

  const closeApp = () => {
    tg?.close();
  };

  return {
    tg,
    user: tg?.initDataUnsafe?.user || DEFAULT_TG_USER,
    triggerHaptic,
    closeApp,
  };
}
