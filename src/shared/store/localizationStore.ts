import { create } from "zustand";

// English Locales
import enCommon from "../../locales/en/common.json";
import enHome from "../../locales/en/home.json";
import enLeaderboard from "../../locales/en/leaderboard.json";
import enWallet from "../../locales/en/wallet.json";
import enDeposit from "../../locales/en/deposit.json";
import enWinners from "../../locales/en/winners.json";
import enEventDetail from "../../locales/en/event_detail.json";
import enCreateSprint from "../../locales/en/create_sprint.json";
import enManageTasks from "../../locales/en/manage_tasks.json";

// Russian Locales
import ruCommon from "../../locales/ru/common.json";
import ruHome from "../../locales/ru/home.json";
import ruLeaderboard from "../../locales/ru/leaderboard.json";
import ruWallet from "../../locales/ru/wallet.json";
import ruDeposit from "../../locales/ru/deposit.json";
import ruWinners from "../../locales/ru/winners.json";
import ruEventDetail from "../../locales/ru/event_detail.json";
import ruCreateSprint from "../../locales/ru/create_sprint.json";
import ruManageTasks from "../../locales/ru/manage_tasks.json";

// Uzbek Locales
import uzCommon from "../../locales/uz/common.json";
import uzHome from "../../locales/uz/home.json";
import uzLeaderboard from "../../locales/uz/leaderboard.json";
import uzWallet from "../../locales/uz/wallet.json";
import uzDeposit from "../../locales/uz/deposit.json";
import uzWinners from "../../locales/uz/winners.json";
import uzEventDetail from "../../locales/uz/event_detail.json";
import uzCreateSprint from "../../locales/uz/create_sprint.json";
import uzManageTasks from "../../locales/uz/manage_tasks.json";

export type Language = "uz" | "ru" | "en";

const translations: Record<Language, Record<string, any>> = {
  en: {
    common: enCommon,
    home: enHome,
    leaderboard: enLeaderboard,
    wallet: enWallet,
    deposit: enDeposit,
    winners: enWinners,
    eventDetail: enEventDetail,
    createSprint: enCreateSprint,
    manageTasks: enManageTasks,
  },
  ru: {
    common: ruCommon,
    home: ruHome,
    leaderboard: ruLeaderboard,
    wallet: ruWallet,
    deposit: ruDeposit,
    winners: ruWinners,
    eventDetail: ruEventDetail,
    createSprint: ruCreateSprint,
    manageTasks: ruManageTasks,
  },
  uz: {
    common: uzCommon,
    home: uzHome,
    leaderboard: uzLeaderboard,
    wallet: uzWallet,
    deposit: uzDeposit,
    winners: uzWinners,
    eventDetail: uzEventDetail,
    createSprint: uzCreateSprint,
    manageTasks: uzManageTasks,
  },
};

// Auto-detect browser/telegram language
const getInitialLanguage = (): Language => {
  const stored = localStorage.getItem("prizerace_lang");
  if (stored === "en" || stored === "ru" || stored === "uz") {
    return stored;
  }

  // Check telegram webapp context window
  const tg = (window as any).Telegram?.WebApp;
  const userLangCode = tg?.initDataUnsafe?.user?.language_code;
  if (userLangCode) {
    if (userLangCode.startsWith("ru")) return "ru";
    if (userLangCode.startsWith("uz")) return "uz";
  }

  // Browser level fallback
  const browserLang = navigator.language || "";
  if (browserLang.startsWith("ru")) return "ru";
  if (browserLang.startsWith("uz")) return "uz";

  return "en";
};

interface LocalizationState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLocalizationStore = create<LocalizationState>((set) => ({
  language: getInitialLanguage(),
  setLanguage: (lang: Language) => {
    localStorage.setItem("prizerace_lang", lang);
    set({ language: lang });
  },
}));

/**
 * Custom translation hook to fetch scoped terms
 * @param namespace Page or component namespace (e.g. "home", "common")
 */
export function useTranslation(namespace: string) {
  const language = useLocalizationStore((state) => state.language);
  const setLanguage = useLocalizationStore((state) => state.setLanguage);

  const t = (keyPath: string, variables?: Record<string, string | number>): string => {
    const keys = keyPath.split(".");
    let target: any = translations[language][namespace];

    for (const key of keys) {
      if (target === undefined || target === null) {
        break;
      }
      target = target[key];
    }

    if (typeof target !== "string") {
      // Return fallback to English namespace and key
      let fallbackTarget: any = translations["en"][namespace];
      for (const key of keys) {
        if (fallbackTarget === undefined || fallbackTarget === null) {
          break;
        }
        fallbackTarget = fallbackTarget[key];
      }
      target = typeof fallbackTarget === "string" ? fallbackTarget : keyPath;
    }

    if (variables) {
      let result = target;
      for (const [vKey, vVal] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{${vKey}}`, "g"), String(vVal));
      }
      return result;
    }

    return target;
  };

  return {
    t,
    language,
    setLanguage,
  };
}
