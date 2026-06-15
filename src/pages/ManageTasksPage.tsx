import { useState } from "react";
import { useCreateTask, useEventTasks } from "../features/tasks/hooks/useTasks";
import { useEventDetails } from "../features/events/hooks/useEvents";
import { useNavigationStore } from "../shared/store/navigationStore";
import { useTranslation } from "../shared/store/localizationStore";
import Card from "../shared/components/ui/Card";
import Button from "../shared/components/ui/Button";
import Badge from "../shared/components/ui/Badge";
import { Spinner } from "../shared/components/ui/Spinner";
import { useToastStore } from "../features/notifications/store/toastStore";
import {
  ArrowLeft,
  Plus,
  CheckSquare,
  Sparkles,
  MessageCircle,
  Info,
  Twitter,
  Youtube,
  Globe,
  PlusCircle,
  Hash,
  X,
  Compass,
  AlertCircle
} from "lucide-react";

export function ManageTasksPage() {
  const { selectedEventId, goBack } = useNavigationStore();
  const { data: event } = useEventDetails(selectedEventId);
  const { data: tasks, isLoading: isTasksLoading } = useEventTasks(selectedEventId);
  const createTaskMutation = useCreateTask();
  const { t, language } = useTranslation("manage_tasks");
  const addToast = useToastStore((state) => state.addToast);

  const [title, setTitle] = useState("Join our Telegram");
  const [description, setDescription] = useState("Subscribe to stay updated and claim reward");
  const [xpReward, setXpReward] = useState(50);
  const [verificationType, setVerificationType] = useState<"manual" | "channel_subscription">("channel_subscription");
  const [requiredChannel, setRequiredChannel] = useState("@prizerace");

  // Visual Quick presets tray
  const quickPresets = [
    {
      title: "Join Telegram Channel",
      desc: "Join our official Telegram community tracker",
      xp: 100,
      type: "channel_subscription" as const,
      chan: "@prizerace"
    },
    {
      title: "Follow X (Twitter)",
      desc: "Follow us on X for regular news & daily codes",
      xp: 120,
      type: "manual" as const,
      chan: ""
    },
    {
      title: "Visit Website",
      desc: "Read our official documentation and tutorial whitepaper",
      xp: 80,
      type: "manual" as const,
      chan: ""
    },
    {
      title: "Watch YouTube video",
      desc: "Watch the mini tutorial on how to claim prizes",
      xp: 150,
      type: "manual" as const,
      chan: ""
    }
  ];

  const applyPreset = (preset: typeof quickPresets[0]) => {
    setTitle(preset.title);
    setDescription(preset.desc);
    setXpReward(preset.xp);
    setVerificationType(preset.type);
    setRequiredChannel(preset.chan);
    addToast(
      language === "uz" ? "Tezkor sozlama yuklandi!" : "Preset applied!",
      "success"
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;

    if (!title.trim() || !description.trim()) {
      addToast("Please fill all required inputs", "error");
      return;
    }

    createTaskMutation.mutate(
      {
        eventId: selectedEventId,
        payload: {
          title,
          description,
          xp_reward: Number(xpReward),
          verification_type: verificationType,
          required_channel: verificationType === "channel_subscription" ? requiredChannel : null,
        },
      },
      {
        onSuccess: () => {
          addToast(
            language === "uz" ? "Vazifa mufavaqiyatli qo'shildi" : "Task added successfully",
            "success"
          );
          // Standard defaults resetting
          setTitle("Join our Telegram");
          setDescription("Subscribe to stay updated and claim reward");
          setXpReward(50);
          setVerificationType("channel_subscription");
          setRequiredChannel("@prizerace");
        },
      }
    );
  };

  const getPlatformIcon = (taskTitle: string, vtype: string) => {
    const term = taskTitle.toLowerCase();
    if (term.includes("telegram") || vtype === "channel_subscription") {
      return <MessageCircle className="w-5 h-5 text-[#0088cc]" />;
    }
    if (term.includes("twitter") || term.includes(" X ") || term.startsWith("x ")) {
      return <Twitter className="w-5 h-5 text-neutral-850" />;
    }
    if (term.includes("youtube") || term.includes("video")) {
      return <Youtube className="w-5 h-5 text-red-600" />;
    }
    if (term.includes("website") || term.includes("visit") || term.includes("link")) {
      return <Globe className="w-5 h-5 text-emerald-600" />;
    }
    return <CheckSquare className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="space-y-5 pb-32 animate-in fade-in duration-300">
      
      {/* Visual Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low border border-outline-variant/25 rounded-xl hover:bg-surface-container active:scale-95 duration-150 transition-all cursor-pointer text-xs font-black uppercase tracking-wider text-on-surface"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          <span className="font-display pr-0.5">{language === "uz" ? "Ortga" : language === "ru" ? "Назад" : "Back"}</span>
        </button>
        <span className="font-display text-[9px] font-black uppercase text-outline tracking-wider">
          {language === "uz" ? "VAZIFALAR SOZLAMASI" : language === "ru" ? "ЗАДАНИЯ СУПЕРВИЗОРА" : "SUPERVISOR DESK"}
        </span>
      </div>

      <div className="space-y-1">
        <h2 className="font-display text-lg font-black tracking-tight text-neutral-800 leading-tight">
          {language === "uz" ? "Sprint Vazifalari" : language === "ru" ? "Задания спринта" : "Manage Tasks"}
        </h2>
        <p className="text-[11px] text-outline font-semibold leading-relaxed">
          {language === "uz" ? "Vazifa faqat qoralama holida ruxsat etiladi." : language === "ru" ? "Задания доступны только на стадии черновика." : "Assign engaging challenges for participants. Tasks are locked upon deposit live-release."}
        </p>
      </div>

      {event && (
        <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-150 flex items-center justify-between shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-outline">
            {language === "uz" ? "Faol maqsad:" : language === "ru" ? "Активная цель:" : "TARGET INTND:"}
          </span>
          <Badge variant="active" className="font-display text-[10px] font-black tracking-wide uppercase px-3 py-1 bg-white border border-neutral-200">
            {event.title}
          </Badge>
        </div>
      )}

      {/* QUICK PRESETS CAROUSEL (Senior Touch UX) */}
      <section className="space-y-2">
        <h3 className="font-display text-[10px] font-black uppercase text-outline tracking-wider pl-1">
          {language === "uz" ? "Tezkor Shablonlar" : language === "ru" ? "Быстрые заготовки" : "One-Click Quick Presets"}
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {quickPresets.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => applyPreset(preset)}
              className="p-3 bg-white hover:bg-neutral-50 active:scale-95 duration-100 border border-outline-variant/20 rounded-2xl text-left shadow-xs cursor-pointer flex flex-col justify-between h-[92px] transition-all"
            >
              <div className="flex justify-between items-start w-full gap-1.5">
                <span className="font-display text-[11px] font-black text-neutral-800 tracking-tight leading-snug line-clamp-1">
                  {preset.title}
                </span>
                <span className="text-xs shrink-0 bg-yellow-500/10 text-yellow-600 font-mono font-black rounded-lg px-1 py-0.5 text-[9px] border border-yellow-300/20">
                  +{preset.xp}XP
                </span>
              </div>
              <p className="text-[9px] text-outline font-semibold line-clamp-2 leading-tight">
                {preset.desc}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Form Card */}
      <Card className="p-5 border border-outline-variant/15 shadow-[0_4px_15px_rgba(0,0,0,0.015)] bg-white space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <PlusCircle className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-display text-xs font-black text-primary uppercase tracking-wider">
            {language === "uz" ? "YANGI VAZIFA" : language === "ru" ? "НОВОЕ ЗАДАНИЕ" : "CREATE NEW TASK"}
          </h3>
        </div>

        <form onSubmit={handleAddTask} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider flex justify-between">
              <span>{language === "uz" ? "Vazifa nomi" : language === "ru" ? "Заголовок задачи" : "Task Title"}</span>
              <span className="text-[10px] text-outline font-mono font-bold">{title.length}/40</span>
            </label>
            <input
              type="text"
              maxLength={40}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-50/50 hover:bg-neutral-50 border border-outline-variant/30 focus:border-primary focus:bg-white rounded-xl p-3 text-sm font-semibold outline-none"
              placeholder="e.g. Follow on Telegram Channel"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pb-1">
            
            <div className="space-y-1.5">
              <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">
                {language === "uz" ? "Mukofot XP" : "Reward"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={xpReward}
                  onChange={(e) => setXpReward(Number(e.target.value))}
                  min={1}
                  max={10000}
                  className="w-full bg-neutral-50/50 hover:bg-neutral-50 border border-outline-variant/30 focus:border-primary focus:bg-white rounded-xl p-3 pr-10 text-sm font-mono font-black text-neutral-800 outline-none"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-extrabold text-[9px] text-[#FFA500] uppercase tracking-widest flex items-center">
                  XP
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">
                {language === "uz" ? "Tekshirish turi" : "Verification type"}
              </label>
              <select
                value={verificationType}
                onChange={(e) => setVerificationType(e.target.value as "manual" | "channel_subscription")}
                className="w-full bg-neutral-50/50 hover:bg-neutral-50 border border-outline-variant/30 focus:border-primary focus:bg-white rounded-xl p-3 text-xs font-extrabold text-neutral-800 outline-none"
              >
                <option value="channel_subscription">Channel Sub</option>
                <option value="manual">Manual / Social Check</option>
              </select>
            </div>

          </div>

          {/* Conditional Input for channel subscribe check */}
          {verificationType === "channel_subscription" && (
            <div className="space-y-1.5 animate-in slide-in-from-top-1.5 duration-200">
              <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">
                {language === "uz" ? "Telegram kanal manzili" : language === "ru" ? "Адрес Telegram канала" : "Telegram Channel Check ID"}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-black text-sm">@</span>
                <input
                  type="text"
                  value={requiredChannel.replace("@", "")}
                  onChange={(e) => setRequiredChannel(`@${e.target.value}`)}
                  className="w-full bg-neutral-50/50 hover:bg-neutral-50 border border-outline-variant/30 focus:border-primary focus:bg-white rounded-xl p-3 pl-8 text-sm font-semibold outline-none"
                  placeholder="prizerace"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">
              {language === "uz" ? "Tavsif / Yo'riqnoma" : language === "ru" ? "Описание" : "Brief description / Prompt"}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-50/50 hover:bg-neutral-50 border border-outline-variant/30 focus:border-primary focus:bg-white rounded-xl p-3 text-sm font-semibold outline-none"
              placeholder="Join our official announcement tracker..."
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={createTaskMutation.isPending}
            className="w-full font-display text-xs font-black uppercase tracking-wider py-3.5 mt-1 bg-gradient-to-r from-primary-container to-blue-600 border-none shadow-md text-white"
            icon={<Plus className="w-4 h-4 text-white" />}
          >
            {language === "uz" ? "Vazifa qo'shish" : language === "ru" ? "Добавить задачу" : "Attach Task to Sprint"}
          </Button>

        </form>
      </Card>

      {/* Task Summary Stack */}
      <div className="space-y-3">
        <h3 className="font-display text-[10px] font-black uppercase text-outline tracking-wider pl-1">
          {language === "uz" ? "Mavjud Vazifalar" : language === "ru" ? "Задачи заезда" : "CONFIGURED CHALLENGES"}
        </h3>
        
        {isTasksLoading ? (
          <div className="flex justify-center p-8 bg-white rounded-2xl border border-outline-variant/15">
            <Spinner />
          </div>
        ) : tasks && tasks.length > 0 ? (
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <Card key={task.id} className="p-4 border border-outline-variant/15 flex gap-3.5 bg-white items-center hover:shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all">
                <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center border border-neutral-150 shrink-0">
                  {getPlatformIcon(task.title, task.verification_type)}
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-display text-xs font-black text-neutral-800 truncate leading-tight">
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-outline font-semibold truncate mt-0.5">
                        {task.description}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-black text-orange-500 shrink-0 leading-none">
                      +{task.xp_reward} <span className="text-[9px] font-semibold text-outline">XP</span>
                    </span>
                  </div>
                  <div className="mt-2 text-[9px] text-primary font-black uppercase tracking-wider flex items-center gap-1 leading-none">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    {language === "uz" ? "TEKShIRISh:" : "CHECK:"} {task.verification_type === "channel_subscription" ? `TELEGRAM ${task.required_channel}` : "MANUAL VERIFY"}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-2xl border border-dashed border-neutral-200">
            <Compass className="w-8 h-8 text-outline/65 mx-auto mb-2" />
            <p className="text-[11px] font-bold text-outline leading-normal">
              {language === "uz" ? "Hozircha birortayam vazifa yo'q." : "No tasks added to this sprint yet. Use presets to instantly pre-fill tasks."}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

export default ManageTasksPage;
