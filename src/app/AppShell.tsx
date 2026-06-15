import { useNavigationStore } from "../shared/store/navigationStore";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useTranslation } from "../shared/store/localizationStore";
import { AppRouter } from "./router";
import { Home, Trophy, BarChart3, User, PlusCircle, Globe } from "lucide-react";

export function AppShell() {
  const { page, navigate, selectedEventId } = useNavigationStore();
  const { user } = useAuth();
  const { t, language, setLanguage } = useTranslation("common");

  // Pages where we suppress standard bottom nav bar to maintain mockup alignment
  const subPages = ["createSprint", "manageTasks", "deposit"];
  const showNav = !subPages.includes(page);

  // Tab trigger
  const handleTabClick = (target: "home" | "leaderboard" | "wallet" | "createSprint") => {
    if (target === "leaderboard") {
      // Pass standard event id context or standard value 1 directly
      navigate("leaderboard", selectedEventId || 1);
    } else {
      navigate(target);
    }
  };

  const getTagline = () => {
    if (language === "uz") return "Musobaqalashing · Yuting · TON Ishlang";
    if (language === "ru") return "Участвуйте · Побеждайте · TON";
    return "Compete · Win · Earn TON";
  };

  return (
    <div className="w-full md:max-w-[420px] bg-background min-h-[100dvh] flex flex-col relative overflow-x-hidden md:border-x md:border-outline-variant/20 md:shadow-2xl mx-auto">
      {/* Top Header Bar (Only shown on non-focused screens to fit screens spec) */}
      {page === "home" && (
        <header className="sticky top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20">
          <div className="flex flex-col">
            <h1 className="font-display text-lg text-primary font-black tracking-tight leading-none">
              🏆 PrizeRace
            </h1>
            <p className="font-display text-[9px] font-black uppercase text-on-surface-variant tracking-widest mt-1.5">
              {getTagline()}
            </p>
          </div>
          
          {/* Elegant inline Language Selector */}
          <button
            onClick={() => {
              if (language === "uz") setLanguage("ru");
              else if (language === "ru") setLanguage("en");
              else setLanguage("uz");
            }}
            className="font-display flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/25 rounded-xl px-3 py-1.5 shadow-xs active:scale-95 transition-all duration-100 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase text-on-surface leading-none tracking-wider">
              {language}
            </span>
          </button>
        </header>
      )}

      {/* Main Content Pane */}
      <main className={`flex-1 px-4 ${page === "home" ? "pt-4" : "pt-6"} pb-32`}>
        {/* Elegant Under Development Notification Banner */}
        <div className="mb-4 p-3 rounded-2xl bg-amber-500/8 border border-amber-500/15 flex items-center gap-2.5 text-amber-700/90 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-xs shrink-0 select-none">🛠️</span>
          <p className="font-display text-[10px] font-black uppercase tracking-wider leading-none">
            {language === "uz" 
              ? "Ilova hali ishlanmoqda" 
              : language === "ru" 
              ? "Приложение еще в разработке" 
              : "App still under development"}
          </p>
        </div>

        <AppRouter />
      </main>

      {/* Bottom Nav Bar (Hidden in Focused/Creation Views) */}
      {showNav && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:max-w-[420px] z-50 flex justify-around items-center px-2 py-3 bg-surface/95 backdrop-blur-lg border-t border-outline-variant/35 shadow-lg pb-safe pb-5">
          {/* Home Tab */}
          <button
            onClick={() => handleTabClick("home")}
            className={`font-display flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer flex-1 ${
              page === "home"
                ? "bg-primary-container text-white shadow-md font-bold"
                : "text-on-surface-variant hover:bg-surface-container-high/40"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1 uppercase tracking-wider leading-none">{t("tabs.home")}</span>
          </button>

          {/* Create Sprint Tab */}
          <button
            onClick={() => handleTabClick("createSprint")}
            className={`font-display flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer flex-1 ${
              page === "createSprint"
                ? "bg-primary-container text-white shadow-md font-bold"
                : "text-on-surface-variant hover:bg-surface-container-high/40"
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1 uppercase tracking-wider leading-none">{t("tabs.races")}</span>
          </button>

          {/* Leaderboard Tab */}
          <button
            onClick={() => handleTabClick("leaderboard")}
            className={`font-display flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer flex-1 ${
              page === "leaderboard"
                ? "bg-primary-container text-white shadow-md font-bold"
                : "text-on-surface-variant hover:bg-surface-container-high/40"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1 uppercase tracking-wider leading-none">{t("tabs.board")}</span>
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => handleTabClick("wallet")}
            className={`font-display flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer flex-1 ${
              page === "wallet"
                ? "bg-primary-container text-white shadow-md font-bold"
                : "text-on-surface-variant hover:bg-surface-container-high/40"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[9px] font-black mt-1 uppercase tracking-wider leading-none">{t("tabs.profile")}</span>
          </button>
        </nav>
      )}
    </div>
  );
}
export default AppShell;
