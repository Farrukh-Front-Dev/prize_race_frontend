import { useState } from "react";
import { useEventsList, useJoinEvent } from "../features/events/hooks/useEvents";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useWalletBalance } from "../features/wallet/hooks/useWallet";
import { useNavigationStore } from "../shared/store/navigationStore";
import { useTranslation } from "../shared/store/localizationStore";
import Card from "../shared/components/ui/Card";
import Badge from "../shared/components/ui/Badge";
import Button from "../shared/components/ui/Button";
import Progress from "../shared/components/ui/Progress";
import { Spinner } from "../shared/components/ui/Spinner";
import { 
  Wallet, 
  Trophy, 
  Target, 
  Award, 
  ChevronRight, 
  Activity, 
  Sparkles, 
  Compass, 
  Clock, 
  CheckCircle2, 
  CalendarClock 
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

type FilterType = "all" | "active" | "finished";

export function HomePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { navigate } = useNavigationStore();
  const { data: events, isLoading: isEventsLoading } = useEventsList();
  const { data: wallet } = useWalletBalance(!!user?.wallet_address);
  const joinEventMutation = useJoinEvent();
  const { t, language } = useTranslation("home");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const handleJoin = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    joinEventMutation.mutate(eventId);
  };

  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[440px]">
        <Spinner size="lg" />
        <p className="mt-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider animate-pulse">
          {t("initializing")}
        </p>
      </div>
    );
  }

  const displayName = user?.first_name || "Alex";
  const displayBalance = user?.wallet_address && wallet 
    ? `${parseFloat(wallet.balance_ton).toFixed(2)}` 
    : "0.00";

  const getTranslatedStatus = (status: string) => {
    if (status === "ACTIVE") {
      if (language === "uz") return "FAOL";
      if (language === "ru") return "АКТИВЕН";
      return "ACTIVE";
    }
    if (status === "FINISHED") {
      if (language === "uz") return "YAKUNLANDI";
      if (language === "ru") return "ЗАВЕРШЕН";
      return "FINISHED";
    }
    if (status === "PENDING_PAYMENT") {
      if (language === "uz") return "TO'LOV KUTILMOQDA";
      if (language === "ru") return "ОЖИДАНИЕ ДЕПОЗИТА";
      return "PENDING DEP";
    }
    return status;
  };

  const getWinnersCutText = (count: number) => {
    if (language === "uz") return `Top ${count} g'olib`;
    if (language === "ru") return `Топ ${count} мест`;
    return `Top ${count} Places`;
  };

  // Filter events logically
  const filteredEvents = events?.filter(event => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return event.status === "ACTIVE";
    if (activeFilter === "finished") return event.status === "FINISHED";
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* High-Contrast Premium Welcome & Wallet card */}
      <section className="relative overflow-hidden rounded-2xl border border-outline-variant/30/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-gradient-to-br from-primary-container to-blue-700 text-white p-5">
        {/* Subtle geometric overlay for elite premium style */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6" />
        <div className="absolute bottom-0 left-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mb-6" />
        
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="font-display text-[10px] font-black tracking-widest uppercase text-white/70">
              {language === "uz" ? "ISHTIROKCHI PROFILI" : language === "ru" ? "ПРОФИЛЬ ГОНЩИКА" : "RACER PROFILE"}
            </p>
            <h2 className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5 leading-none">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              {displayName}
            </h2>
          </div>
          
          {user?.wallet_address ? (
            <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-full py-1 px-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-display text-[9px] font-black text-emerald-300 uppercase tracking-widest leading-none">
                {language === "uz" ? "ZANJIR" : language === "ru" ? "СЕТЬ" : "TON LINKED"}
              </span>
            </div>
          ) : (
            <button
              onClick={() => navigate("wallet")}
              className="font-display px-3 py-1.5 text-[9px] font-black uppercase tracking-widest bg-white text-primary rounded-full hover:bg-neutral-50 active:scale-95 transition-transform duration-100 cursor-pointer shadow-sm"
            >
              {t("connect_ton")}
            </button>
          )}
        </div>

        <div className="mt-6 flex justify-between items-end">
          <div className="space-y-1">
            <span className="font-display text-[9px] font-black text-white/60 uppercase tracking-widest block leading-none">
              {t("your_balance")}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-3.5xl font-extrabold tracking-tight">{displayBalance}</span>
              <span className="font-display text-[11px] font-black text-white/80">TON</span>
            </div>
          </div>

          <button
            onClick={() => navigate("wallet")}
            className="font-display flex items-center gap-1 py-2 px-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all font-bold text-xs"
          >
            <Wallet className="w-3.5 h-3.5 text-white" />
            <span>{language === "uz" ? "Boshqarish" : language === "ru" ? "Кабинет" : "Manage"}</span>
          </button>
        </div>
      </section>

      {/* Minimalist Micro Statistics Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 flex flex-col justify-between">
          <p className="font-display text-[9px] font-black text-on-surface-variant uppercase tracking-widest leading-none">
            {language === "uz" ? "JAMG'ARMALAR" : language === "ru" ? "ОБЩИЙ ФОНД" : "SUM POOLS"}
          </p>
          <p className="text-sm font-extrabold text-on-surface tracking-tight mt-1.5 font-mono">
            {events ? events.reduce((sum, e) => sum + parseFloat(e.total_prize_pool || "0"), 0).toFixed(1) : "0"} TON
          </p>
        </div>
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 flex flex-col justify-between">
          <p className="font-display text-[9px] font-black text-on-surface-variant uppercase tracking-widest leading-none">
            {language === "uz" ? "Poygalar" : language === "ru" ? "ВСЕГО ГОНОК" : "TOTAL RUNS"}
          </p>
          <p className="text-sm font-extrabold text-on-surface tracking-tight mt-1.5 flex items-center gap-1 font-mono">
            <Activity className="w-3.5 h-3.5 text-primary" />
            {events?.length || 0}
          </p>
        </div>
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 flex flex-col justify-between">
          <p className="font-display text-[9px] font-black text-on-surface-variant uppercase tracking-widest leading-none">
            {language === "uz" ? "MAOMOLAR" : language === "ru" ? "СКОРОСТЬ" : "LIVE SPRINT"}
          </p>
          <p className="text-sm font-extrabold text-primary tracking-tight mt-1.5 flex items-center gap-1 font-mono">
            <Compass className="w-3.5 h-3.5 text-primary-container animate-spin" style={{ animationDuration: "12s" }} />
            {events?.filter(e => e.status === "ACTIVE").length || 0}
          </p>
        </div>
      </div>

      {/* Elegant Tab Headers / Section title spacer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-extrabold text-sm tracking-tight text-on-surface flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="uppercase tracking-wider">{t("active_sprints")}</span>
          </h3>
          <span
            onClick={() => navigate("wallet")}
            className="font-display text-[10px] font-black uppercase text-primary tracking-wider active:scale-95 cursor-pointer flex items-center gap-0.5"
          >
            {t("my_wallet")} <ChevronRight className="w-3 h-3 text-primary" />
          </span>
        </div>

        {/* Minimalist Filter Pills */}
        <div className="flex gap-1.5 p-1 bg-surface-container-low border border-outline-variant/30 rounded-xl">
          {(["all", "active", "finished"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`font-display flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-150 cursor-pointer ${
                activeFilter === filter
                  ? "bg-white text-on-surface shadow-sm border border-outline-variant/20"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {filter === "all" 
                ? (language === "uz" ? "Barchasi" : language === "ru" ? "Все" : "All") 
                : filter === "active" 
                ? (language === "uz" ? "Faol" : language === "ru" ? "Активные" : "Active") 
                : (language === "uz" ? "Yakunlangan" : language === "ru" ? "Завершенные" : "Finished")}
            </button>
          ))}
        </div>
      </div>

      {/* Sprints listing component wrapper */}
      {isEventsLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner size="md" />
          <p className="mt-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">{t("loading_races")}</p>
        </div>
      ) : filteredEvents && filteredEvents.length > 0 ? (
        <div className="space-y-3.5">
          {filteredEvents.map((event) => {
            const isOrganizer = user?.id === event.organizer_id;
            const daysLeftText = (() => {
              try {
                const now = new Date();
                const end = parseISO(event.end_date);
                if (end < now) {
                  return language === "uz" ? "Tugadi" : language === "ru" ? "Завершен" : "Finished";
                }
                return formatDistanceToNow(end, { addSuffix: false }) + (language === "uz" ? " qoldi" : language === "ru" ? " осталось" : " left");
              } catch (_) {
                return language === "uz" ? "Yaqinda yakunlanadi" : language === "ru" ? "Скоро завершится" : "ends soon";
              }
            })();

            const isFinished = event.status === "FINISHED";

            return (
              <Card
                key={event.id}
                onClick={() => navigate("eventDetail", event.id)}
                className={`p-4 border border-outline-variant/25 transition-all relative overflow-hidden bg-white hover:border-primary/40 ${
                  isFinished ? "opacity-90 bg-neutral-50/70" : ""
                }`}
              >
                {/* Visual decorative bar status */}
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                  isFinished ? "bg-neutral-300" : event.status === "ACTIVE" ? "bg-primary" : "bg-amber-400"
                }`} />

                <div className="flex justify-between items-start gap-4 pl-1">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-extrabold text-[15px] text-on-surface tracking-tight leading-snug">
                        {event.title}
                      </h4>
                      {isOrganizer && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md">
                          <span className="text-[8px] font-black text-primary uppercase tracking-widest leading-none">
                            {language === "uz" ? "Tashkilotchi" : language === "ru" ? "Организатор" : "Host"}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-1 leading-normal font-medium">
                      {event.description || t("default_description")}
                    </p>
                  </div>
                  
                  <Badge variant={event.status.toLowerCase() as any}>
                    {getTranslatedStatus(event.status)}
                  </Badge>
                </div>

                {/* Info parameters Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 pl-1">
                  <div className="bg-surface-container-low rounded-xl p-2.5 flex items-center gap-2 border border-outline-variant/15">
                    <Trophy className="w-3.5 h-3.5 text-secondary-container" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-wider leading-none">
                        {language === "uz" ? "MUKOFOT" : language === "ru" ? "ФОНД" : "PRIZE POOL"}
                      </span>
                      <span className="font-mono text-xs font-black text-on-surface tracking-tight mt-0.5">
                        {event.total_prize_pool} TON
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-surface-container-low rounded-xl p-2.5 flex items-center gap-2 border border-outline-variant/15">
                    <Target className="w-3.5 h-3.5 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-wider leading-none">
                        {language === "uz" ? "TAQSIMOT" : language === "ru" ? "КВОТА" : "ALLOCATION"}
                      </span>
                      <span className="text-xs font-bold text-on-surface tracking-tight mt-0.5">
                        {getWinnersCutText(event.top_n_winners)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Active and Progress block */}
                {event.status === "ACTIVE" && (
                  <div className="space-y-2 mt-4 pl-1">
                    <div className="flex justify-between items-center text-[9px] font-black text-on-surface-variant uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary-container" />
                        {t("progress_timeline")}
                      </span>
                      <span className="text-primary font-black flex items-center gap-1">
                        <CalendarClock className="w-3 h-3" />
                        {daysLeftText}
                      </span>
                    </div>
                    
                    <Progress value={65} className="h-1 bg-surface-container-high/60" />
                    
                    {!isOrganizer && (
                      <Button
                        variant="primary"
                        isLoading={joinEventMutation.isPending && joinEventMutation.variables === event.id}
                        onClick={(e) => handleJoin(e, event.id)}
                        className="w-full mt-3 font-extrabold py-3.5 text-xs uppercase tracking-wider shadow-sm cursor-pointer"
                      >
                        {t("join_event")}
                      </Button>
                    )}
                  </div>
                )}

                {/* Draft and Pending actions */}
                {event.status === "PENDING_PAYMENT" && (
                  <div className="mt-4 pl-1">
                    {isOrganizer ? (
                      <Button
                        variant="success"
                        className="w-full py-3.5 font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md shadow-emerald-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("deposit", event.id);
                        }}
                      >
                        {t("finish_deposit")}
                      </Button>
                    ) : (
                      <div className="w-full text-center py-2 bg-amber-50/60 rounded-xl text-[10px] font-extrabold text-amber-700 border border-amber-200/50 uppercase tracking-widest">
                        {t("awaiting_deposit")}
                      </div>
                    )}
                  </div>
                )}

                {/* Finished State view */}
                {isFinished && (
                  <div className="mt-4 pt-3.5 border-t border-outline-variant/35 pl-1 flex justify-between items-center text-xs font-bold">
                    <span className="text-on-surface-variant flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
                      {t("event_finished")}
                    </span>
                    <span className="text-primary hover:text-primary-container flex items-center gap-0.5 active:scale-95 duration-100 text-[11px] font-black uppercase tracking-wider">
                      {t("see_winners")} <ChevronRight className="w-3.5 h-3.5 text-primary" />
                    </span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl bg-white border border-outline-variant/25">
          <Award className="w-10 h-10 text-outline-variant animate-pulse mb-3" />
          <h4 className="font-extrabold text-sm text-on-surface uppercase tracking-wider">{t("no_sprints")}</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs mt-1">
            {t("no_sprints_desc")}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("createSprint")} 
            className="font-extrabold mt-4 text-[10px] uppercase tracking-wider py-2 px-4 border border-outline shadow-sm cursor-pointer"
          >
            {t("create_first")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default HomePage;

