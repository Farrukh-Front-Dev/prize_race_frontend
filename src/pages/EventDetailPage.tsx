import { useState } from "react";
import { useEventDetails, useJoinEvent, useLockEvent, useFinishEvent } from "../features/events/hooks/useEvents";
import { useEventTasks, useVerifyTask } from "../features/tasks/hooks/useTasks";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useNavigationStore } from "../shared/store/navigationStore";
import { useTranslation } from "../shared/store/localizationStore";
import Button from "../shared/components/ui/Button";
import Card from "../shared/components/ui/Card";
import Badge from "../shared/components/ui/Badge";
import { Spinner } from "../shared/components/ui/Spinner";
import { useToastStore } from "../features/notifications/store/toastStore";
import {
  ChevronLeft,
  Calendar,
  Trophy,
  Target,
  Sparkles,
  Zap,
  Info,
  CheckCircle,
  FileText,
  ListTodo,
  TrendingUp,
  Plus,
  Lock,
  Flag,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export function EventDetailPage() {
  const { selectedEventId, goBack, navigate } = useNavigationStore();
  const { user } = useAuth();
  
  const { data: event, isLoading: isEventLoading } = useEventDetails(selectedEventId);
  const { data: tasks, isLoading: isTasksLoading } = useEventTasks(selectedEventId);
  
  const joinMutation = useJoinEvent();
  const lockMutation = useLockEvent();
  const finishMutation = useFinishEvent();
  const verifyTaskMutation = useVerifyTask();
  const addToast = useToastStore((state) => state.addToast);
  const { t, language } = useTranslation("eventDetail");

  const [activeTab, setActiveTab] = useState<"info" | "tasks" | "board">("tasks");

  if (isEventLoading || !event) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-on-surface-variant animate-pulse">{t("loading_missions")}</p>
      </div>
    );
  }

  const isOrganizer = user?.id === event.organizer_id;

  const handleJoin = () => {
    joinMutation.mutate(event.id);
  };

  const handleLock = () => {
    lockMutation.mutate(event.id, {
      onSuccess: () => {
        navigate("deposit", event.id);
      },
    });
  };

  const handleFinish = () => {
    finishMutation.mutate(event.id);
  };

  const handleVerify = (taskId: number) => {
    verifyTaskMutation.mutate(taskId);
  };

  // Safe Date string parsing
  let startDateText = "Starts July 15";
  let endDateText = "Ends soon";
  try {
    startDateText = `${language === "uz" ? "Boshlanadi" : language === "ru" ? "Начало" : "Starts"} ${format(parseISO(event.start_date), "MMM d, yyyy")}`;
    endDateText = `${language === "uz" ? "Tugaydi" : language === "ru" ? "Конец" : "Ends"} ${format(parseISO(event.end_date), "MMM d, yyyy")}`;
  } catch (_) {}

  const getTranslatedStatus = (status: string) => {
    if (status === "ACTIVE") return t("status_active");
    if (status === "FINISHED") return t("status_finished");
    if (status === "PENDING_PAYMENT") return t("status_pending");
    return status;
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Sleek Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low border border-outline-variant/25 rounded-xl hover:bg-surface-container active:scale-95 duration-150 transition-all cursor-pointer text-xs font-black uppercase tracking-wider text-on-surface"
        >
          <ChevronLeft className="w-4 h-4 text-primary" />
          <span className="font-display pr-0.5">{language === "uz" ? "Ortga" : language === "ru" ? "Назад" : "Back"}</span>
        </button>
        <span className="font-display text-[10px] font-black uppercase text-on-surface-variant tracking-widest">
          {t("title") || "Sprint detail"}
        </span>
      </div>

      {/* Main Focus Detail Card */}
      <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        {/* Subtle accent line for statuses */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          event.status === "ACTIVE" ? "bg-primary" : event.status === "FINISHED" ? "bg-neutral-350" : "bg-amber-400"
        }`} />

        <div className="flex items-center justify-between mb-4">
          <Badge variant={event.status.toLowerCase() as any}>
            {getTranslatedStatus(event.status)}
          </Badge>
          <span className="font-display text-[10px] font-black uppercase text-on-surface-variant tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
            {endDateText}
          </span>
        </div>

        <h2 className="font-display text-xl font-extrabold text-on-surface tracking-tight mb-2">
          {event.title}
        </h2>
        
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed mb-5">
          {event.description || (language === "uz" ? "Ijtimoiy topshiriqlarni bajarib mukofotga ega bo'ling." : language === "ru" ? "Выполняйте социальные задания, чтобы забрать долю призового фонда." : "Help us grow our ecosystem by completing these simple social tasks.")}
        </p>

        {/* Dynamic Minimal Stats Row without clumsy emojis */}
        <div className="grid grid-cols-3 gap-2 border-t border-outline-variant/20 pt-4 mt-2">
          <div className="flex flex-col">
            <span className="font-display text-[8px] font-black text-on-surface-variant uppercase tracking-widest leading-none">
              {t("prize_pool") || "PRIZE POOL"}
            </span>
            <span className="font-mono text-[14px] font-black text-primary tracking-tight mt-1">
              {event.total_prize_pool} TON
            </span>
          </div>

          <div className="flex flex-col border-x border-outline-variant/20 px-2.5">
            <span className="font-display text-[8px] font-black text-on-surface-variant uppercase tracking-widest leading-none">
              {t("top_winners") || "WINNERS"}
            </span>
            <span className="font-display text-[13px] font-extrabold text-on-surface tracking-tight mt-1">
              {t("top_winners_count", { count: event.top_n_winners })}
            </span>
          </div>

          <div className="flex flex-col pl-2.5">
            <span className="font-display text-[8px] font-black text-on-surface-variant uppercase tracking-widest leading-none">
              {language === "uz" ? "SHART" : language === "ru" ? "УСЛОВИЕ" : "RULE"}
            </span>
            <span className="font-display text-[13px ] text-xs font-black text-primary uppercase tracking-wider mt-1 block">
              {language === "uz" ? "Ulanish" : language === "ru" ? "Участие" : "Complete"}
            </span>
          </div>
        </div>
      </div>

      {/* Modern Standing Dashboard widget */}
      {event.status === "ACTIVE" && (
        <div className="relative overflow-hidden rounded-2xl bg-neutral-900 text-white p-4.5 border border-neutral-800 shadow-md">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-primary/20 to-transparent pointer-events-none" />
          <div className="flex justify-between items-center relative z-10">
            <div className="space-y-1">
              <span className="font-display text-[8px] font-black text-white/50 uppercase tracking-widest block leading-none">
                {language === "uz" ? "MENING O'RNIM" : language === "ru" ? "МОЯ ПОЗИЦИЯ" : "MY STANDING"}
              </span>
              <span className="font-display text-[15px] font-extrabold tracking-tight flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                {language === "uz" ? "Poygachi #42" : language === "ru" ? "Гонщик #42" : "Racer Rank #42"}
              </span>
            </div>
            
            <div className="bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-1.5 transition-all">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span className="font-mono text-xs font-black">320 XP</span>
            </div>
          </div>
        </div>
      )}

      {/* Curated Mobile Tab Trigger Switcher */}
      <section className="space-y-4">
        <div className="bg-surface-container-low p-1 rounded-xl flex items-center gap-1 border border-outline-variant/20 whitespace-nowrap">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`font-display flex-1 py-2 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
              activeTab === "tasks"
                ? "bg-white text-on-surface shadow-sm border border-outline-variant/15"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            {language === "uz" ? "Topshiriqlar" : language === "ru" ? "Задачи" : "Tasks"}
          </button>
          
          <button
            onClick={() => setActiveTab("info")}
            className={`font-display flex-1 py-2 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
              activeTab === "info"
                ? "bg-white text-on-surface shadow-sm border border-outline-variant/15"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            {language === "uz" ? "Qoidalar" : language === "ru" ? "Инфо" : "Rules"}
          </button>
          
          <button
            onClick={() => navigate("leaderboard", event.id)}
            className="font-display flex-1 py-2 text-center text-[10px] font-black uppercase tracking-wider rounded-lg text-on-surface-variant hover:text-on-surface transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer select-none"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            {language === "uz" ? "Natijalar" : language === "ru" ? "Лидеры" : "Board"}
          </button>
        </div>

        {/* Tab Render Body */}
        <div className="space-y-3">
          
          {/* Rules Layout Tab */}
          {activeTab === "info" && (
            <div className="bg-white rounded-2xl border border-outline-variant/25 p-4.5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
              <h3 className="font-display font-extrabold text-xs text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-primary" />
                {language === "uz" ? "REYTING QOIDALARI" : language === "ru" ? "ПРАВИЛА НАЧИСЛЕНИЯ" : "ENGAGEMENT PROTOCOL"}
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <span className="font-display font-black text-2xl text-primary/15 leading-none shrink-0 tracking-wider">01</span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-extrabold text-on-surface tracking-tight uppercase">
                      {language === "uz" ? "Tasdiqlash" : language === "ru" ? "Модерация" : "Verification"}
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                      {language === "uz" ? "Bajarilgan vazifalar Telegram API yoki administratorlar orqali ishonchli tekshiriladi." : language === "ru" ? "Заявки автоматически проверяются через Telegram API или вручную модератором." : "Tasks are audited securely utilizing the official Telegram core APIs and dedicated ecosystem moderators."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start border-t border-outline-variant/15 pt-3.5">
                  <span className="font-display font-black text-2xl text-primary/15 leading-none shrink-0 tracking-wider">02</span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-extrabold text-on-surface tracking-tight uppercase">
                      {language === "uz" ? "Mukofot Chegarasi" : language === "ru" ? "Лимит наград" : "Reward Quotas"}
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                      {language === "uz" ? `Mukofot jamg'armasi faqat eng birinchi poygaga kelgan ${event.top_n_winners} ta ishtirokchi orasida ulashiladi.` : language === "ru" ? `Только первые ${event.top_n_winners} мест в турнирной таблице разделят призовые.` : `Only early racers filling up to the top ${event.top_n_winners} ranks will safely divide the dynamic smart-contract pool.`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start border-t border-outline-variant/15 pt-3.5">
                  <span className="font-display font-black text-2xl text-primary/15 leading-none shrink-0 tracking-wider">03</span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-extrabold text-on-surface tracking-tight uppercase">
                      {language === "uz" ? "Xavfsiz To'lov" : language === "ru" ? "TON Выплата" : "Instant Settlements"}
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                      {language === "uz" ? "Jakuniy hisobdan so'ng, mukofotlar ulangan hamyoningizga avtomatik tarzda o'tkaziladi." : language === "ru" ? "По окончании спринта выигранные TON сразу перечисляются на ваш кошелек." : "Rewards are programmatically dispersed into your designated decentralized TON wallet after completion validation."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              {isOrganizer && (
                <div className="pt-4.5 border-t border-outline-variant/20 flex flex-col gap-2">
                  {event.status === "DRAFT" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => navigate("manageTasks", event.id)}
                        className="w-full font-black text-xs uppercase tracking-wider py-3.5 cursor-pointer shadow-xs border border-outline"
                      >
                        {language === "uz" ? "Vazifa sozlash" : language === "ru" ? "Настройки задач" : "Edit Tasks Panel"}
                      </Button>
                      <Button
                        variant="primary"
                        isLoading={lockMutation.isPending}
                        onClick={handleLock}
                        className="w-full font-black text-xs uppercase tracking-wider py-3.5 cursor-pointer shadow-md"
                      >
                        {language === "uz" ? "Poygani faollashtirish" : language === "ru" ? "Запустить гонку" : "Activate Live Speedrun"}
                      </Button>
                    </>
                  )}
                  {event.status === "ACTIVE" && (
                    <div className="pt-2 space-y-3 bg-primary/5 rounded-xl p-3 border border-primary/15">
                      <p className="text-[10px] text-primary font-black uppercase tracking-wider text-center">
                        {language === "uz" ? "Siz ushbu poyga tashkilotchisiz" : language === "ru" ? "Вы организатор этой гонки" : "You are the supervisor"}
                      </p>
                      <Button
                        variant="primary"
                        isLoading={finishMutation.isPending}
                        onClick={handleFinish}
                        className="w-full font-black text-xs uppercase tracking-wider py-3.5 cursor-pointer shadow-sm text-white"
                      >
                        {language === "uz" ? "Tugallash va Tarqatish" : language === "ru" ? "Завершить и выплатить" : "Conclude & Disperse TON"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Social Missions Tab */}
          {activeTab === "tasks" && (
            <div className="space-y-3">
              {isTasksLoading ? (
                <div className="flex flex-col items-center justify-center py-14">
                  <Spinner size="md" />
                  <p className="mt-3 text-xs font-black text-on-surface-variant uppercase tracking-widest">{t("loading_missions")}</p>
                </div>
              ) : tasks && tasks.length > 0 ? (
                tasks.map((task, idx) => {
                  return (
                    <div 
                      key={task.id} 
                      className="bg-white rounded-2xl border border-outline-variant/20 p-4 flex gap-3.5 relative overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.01)] hover:border-primary/30 transition-all"
                    >
                      {/* Step index wrapper */}
                      <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/15 flex items-center justify-center font-display text-xs font-black text-on-surface-variant shrink-0 font-mono">
                        {(idx + 1).toString().padStart(2, "0")}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="space-y-0.5 leading-tight">
                            <h4 className="font-display text-sm font-extrabold text-on-surface tracking-tight truncate">
                              {task.title}
                            </h4>
                            <p className="text-xs text-on-surface-variant font-medium truncate">
                              {task.description || (language === "uz" ? "A'zo bo'ling va poygada qoling" : language === "ru" ? "Оставайтесь на связи" : "Stay tuned with this request")}
                            </p>
                          </div>
                          <span className="font-display text-[9px] font-black text-primary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 tracking-wider whitespace-nowrap leading-none shrink-0">
                            +{task.xp_reward} XP
                          </span>
                        </div>

                        {event.status === "ACTIVE" ? (
                          <Button
                            variant={task.verification_type === "channel_subscription" ? "primary" : "outline"}
                            isLoading={verifyTaskMutation.isPending && verifyTaskMutation.variables === task.id}
                            onClick={() => handleVerify(task.id)}
                            className="w-full text-[10px] py-2.5 font-black uppercase tracking-wider cursor-pointer"
                          >
                            {task.verification_type === "channel_subscription" 
                              ? ((language === "uz" ? "Kanal: " : language === "ru" ? "Канал: " : "Channel: ") + task.required_channel) 
                              : (language === "uz" ? "Tasdiqlash" : language === "ru" ? "Выполнить" : "Verify Task")}
                          </Button>
                        ) : (
                          <div className="w-full bg-neutral-50 border border-neutral-200/50 py-2 text-center text-[10px] font-black uppercase tracking-widest text-neutral-400 rounded-xl">
                            {language === "uz" ? "OYIN FAOL EMAS" : language === "ru" ? "ГОНКАОФФЛАЙН" : "SPEEDRUN INACTIVE"}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-outline-variant/60 flex flex-col items-center">
                  <ListTodo className="w-8 h-8 text-neutral-300 mb-3" />
                  <h4 className="font-display font-extrabold text-xs text-on-surface uppercase tracking-wider">
                    {language === "uz" ? "Ulanish uchun vazifalar yo'q" : language === "ru" ? "Нет доступных заданий" : "NO SPRINT TASKS"}
                  </h4>
                  <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed max-w-xs">
                    {language === "uz" ? "Hozircha ushbu poyga uchun ijtimoiy poyga vazifalari joylanmagan." : language === "ru" ? "Организатор еще не выложил задания в этой гонке." : "The coordinator has not programmed any tasks into this live speedrun yet."}
                  </p>
                  {isOrganizer && event.status === "DRAFT" && (
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("manageTasks", event.id)} 
                      className="mt-4 font-black text-[10px] uppercase tracking-wider py-2 px-4 shadow-xs border border-outline whitespace-nowrap cursor-pointer"
                    >
                      {language === "uz" ? "Vazifalarni joylash" : language === "ru" ? "Добавить задания" : "Configure Tasks"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
export default EventDetailPage;
