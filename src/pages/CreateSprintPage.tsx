import { useState } from "react";
import { useCreateEvent } from "../features/events/hooks/useEvents";
import { useNavigationStore } from "../shared/store/navigationStore";
import { useTranslation } from "../shared/store/localizationStore";
import Card from "../shared/components/ui/Card";
import Button from "../shared/components/ui/Button";
import {
  ArrowLeft,
  Edit,
  Sparkles,
  Trophy,
  Plus,
  Minus,
  Calendar,
  CalendarDays,
  Zap,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  AlertCircle,
  FileText,
  BadgeDollarSign,
  Info
} from "lucide-react";

export function CreateSprintPage() {
  const { goBack, navigate } = useNavigationStore();
  const createMutation = useCreateEvent();
  const { t, language } = useTranslation("create_sprint");

  // Step wizard state
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [title, setTitle] = useState("Summer TON Sprint");
  const [description, setDescription] = useState(
    "Complete social tasks to win big from the seasonal prize pool!"
  );
  const [prizePool, setPrizePool] = useState("250.0");
  const [winnersCount, setWinnersCount] = useState(10);
  const [startDate, setStartDate] = useState("2026-06-20");
  const [endDate, setEndDate] = useState("2026-06-27");

  // Validation warnings
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleIncrement = () => setWinnersCount((prev) => prev + 5);
  const handleDecrement = () => setWinnersCount((prev) => Math.max(1, prev - 5));

  // Quick duration helper (adds days to current startDate)
  const setDurationInDays = (days: number) => {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    setEndDate(end.toISOString().split("T")[0]);
  };

  const validateStep1 = () => {
    if (!title.trim()) {
      setValidationError(
        language === "uz" ? "Sarlavha bo'sh bo'lishi mumkin emas" : language === "ru" ? "Название не может быть пустым" : "Sprint title is required"
      );
      return false;
    }
    if (description.length < 10) {
      setValidationError(
        language === "uz" ? "Tavsif kamida 10 ta belgidan iborat bo'lishi kerak" : language === "ru" ? "Описание должно содержать не менее 10 символов" : "Description must be at least 10 characters long"
      );
      return false;
    }
    setValidationError(null);
    return true;
  };

  const validateStep2 = () => {
    const amount = parseFloat(prizePool);
    if (!prizePool || isNaN(amount) || amount <= 0) {
      setValidationError(
        language === "uz" ? "Mukofot jamg'armasi noto'g'ri kiritildi" : language === "ru" ? "Неверная сумма призового фонда" : "Enter a valid TON prize allocation"
      );
      return false;
    }
    if (winnersCount <= 0) {
      setValidationError(
        language === "uz" ? "G'oliblar soni kamida 1 kishi bo'lishi kerak" : language === "ru" ? "Минимум 1 победитель" : "At least 1 winner is required"
      );
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleNextStep = () => {
    if (activeStep === 1) {
      if (validateStep1()) setActiveStep(2);
    } else if (activeStep === 2) {
      if (validateStep2()) setActiveStep(3);
    }
  };

  const handlePrevStep = () => {
    setValidationError(null);
    if (activeStep > 1) {
      setActiveStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleSaveDraft = () => {
    if (!validateStep1() || !validateStep2()) return;
    createMutation.mutate(
      {
        title,
        description,
        top_n_winners: winnersCount,
        total_prize_pool: prizePool,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
      },
      {
        onSuccess: () => {
          navigate("home");
        },
      }
    );
  };

  const handleLockDeposit = () => {
    if (!validateStep1() || !validateStep2()) return;
    createMutation.mutate(
      {
        title,
        description,
        top_n_winners: winnersCount,
        total_prize_pool: prizePool,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
      },
      {
        onSuccess: (data) => {
          navigate("deposit", data.id);
        },
      }
    );
  };

  return (
    <div className="space-y-5 pb-36 animate-in fade-in duration-300">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low border border-outline-variant/25 rounded-xl hover:bg-surface-container active:scale-95 duration-150 transition-all cursor-pointer text-xs font-black uppercase tracking-wider text-on-surface"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          <span className="font-display">{language === "uz" ? "Bekor qilish" : language === "ru" ? "Отмена" : "Cancel"}</span>
        </button>
        <div className="flex items-center gap-1">
          <span className="font-display text-[9px] font-black uppercase text-outline tracking-wider">
            {language === "uz" ? `QADAM ${activeStep} / 3` : language === "ru" ? `ШАГ ${activeStep} / 3` : `STAGE ${activeStep} OF 3`}
          </span>
        </div>
      </div>

      {/* Elegant Horizontal Progress Bar */}
      <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden flex gap-0.5">
        <div className={`h-full transition-all duration-300 rounded-l-full ${activeStep >= 1 ? "bg-primary w-1/3" : "bg-neutral-100"}`} />
        <div className={`h-full transition-all duration-300 ${activeStep >= 2 ? "bg-primary w-1/3" : "bg-neutral-100"}`} />
        <div className={`h-full transition-all duration-300 rounded-r-full ${activeStep >= 3 ? "bg-primary w-1/3" : "bg-neutral-100"}`} />
      </div>

      {/* Persistent Beautiful Live Preview Card */}
      <Card variant="primary" className="p-5 relative overflow-hidden shadow-lg border border-blue-400/20 bg-gradient-to-br from-primary-container to-blue-700 text-white min-h-[140px]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
        
        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-wider text-white">
          {language === "uz" ? "JONLI KO'RISH" : language === "ru" ? "PREVIEW" : "REAL-TIME PREVIEW"}
        </div>

        <div className="flex items-center gap-3 mb-4 mt-1">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
            <Sparkles className="w-5 h-5 text-[#FFD700] fill-current" />
          </div>
          <div className="min-w-0 pr-16">
            <h2 className="font-display text-sm font-black tracking-tight text-white truncate leading-tight">
              {title || (language === "uz" ? "Sarlavhasiz Sprint" : language === "ru" ? "Безымянный заезд" : "Untitled Sprint")}
            </h2>
            <p className="text-[9px] text-white/70 uppercase font-black tracking-wider flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              {startDate ? `${startDate} -> ${endDate}` : "TBD"}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-end pt-3 border-t border-white/10">
          <div>
            <p className="text-[9px] uppercase text-white/60 font-black tracking-widest pl-0.5">
              {language === "uz" ? "MUKOFOT JAMG'ARMASI" : language === "ru" ? "ПРИЗОВОЙ ФОНД" : "REWARD ALLOCATION"}
            </p>
            <p className="font-mono text-2xl font-black mt-0.5 text-white leading-none">
              {prizePool || "0.00"} <span className="text-xs font-black text-white/80">TON</span>
            </p>
          </div>
          <span className="text-[10px] font-black uppercase text-emerald-100 bg-white/15 border border-white/10 rounded-lg px-2.5 py-1 leading-none shrink-0">
            {language === "uz" ? `TOP ${winnersCount} G'olib` : language === "ru" ? `ТОП ${winnersCount} Мест` : `TOP ${winnersCount} Spots`}
          </span>
        </div>
      </Card>

      {/* Validation Alert Section */}
      {validationError && (
        <div className="p-3.5 bg-red-50 text-red-800 rounded-2xl border border-red-200/50 flex items-start gap-2.5 animate-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs font-bold leading-normal">{validationError}</p>
        </div>
      )}

      {/* STEP INTERFACES */}
      <section className="space-y-4">
        
        {/* STEP 1: IDENTITY */}
        {activeStep === 1 && (
          <Card className="p-5 space-y-4 border border-outline-variant/15 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.015)]">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-display text-xs font-black text-primary uppercase tracking-wider">
                {language === "uz" ? "1-QADAM: SPRINT KIMLIGI" : language === "ru" ? "ШАГ 1: КАРТОЧКА ЗАЕЗДА" : "STEP 1: SPRINT IDENTITY"}
              </h3>
            </div>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
                <span>{language === "uz" ? "Sarlavha" : language === "ru" ? "Название спринта" : "Title"}</span>
                <span className="text-[10px] text-outline font-mono font-bold">{title.length}/40</span>
              </label>
              <input
                type="text"
                maxLength={40}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-50/50 hover:bg-neutral-50 border border-outline-variant/30 focus:border-primary focus:bg-white rounded-xl p-3 text-sm font-semibold outline-none transition-all duration-150"
                placeholder="e.g. Winter TON Track"
              />
              <p className="text-[10px] text-outline/80 leading-normal font-semibold">
                {language === "uz" ? "Foydalanuvchilarga jozibador bo'lgan ochiq va qisqa nom kiriting." : language === "ru" ? "Короткое, броское имя для привлечения большего числа участников." : "Choose an eye-catching, self-explanatory headline for the general dashboard."}
              </p>
            </div>

            {/* Description Description */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
                <span>{language === "uz" ? "Tavsif" : language === "ru" ? "Описание задач" : "Description"}</span>
                <span className="text-[10px] text-outline font-mono font-bold">{description.length}/150</span>
              </label>
              <textarea
                rows={4}
                maxLength={150}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-neutral-50/50 hover:bg-neutral-50 border border-outline-variant/30 focus:border-primary focus:bg-white rounded-xl p-3 text-sm font-semibold outline-none transition-all duration-150 resize-none"
                placeholder={language === "uz" ? "Ushbu sprint nima haqida ekanligini tushuntiring..." : "Define requirements, prizes, and specific terms..."}
              />
              <p className="text-[10px] text-outline/80 leading-normal font-semibold">
                {language === "uz" ? "Ishtirok etish shartlarini aniq belgilang." : language === "ru" ? "Опишите условия распределения наград и прохождения заданий." : "Keep it descriptive. Define limits, social actions required, or extra details."}
              </p>
            </div>
          </Card>
        )}

        {/* STEP 2: REWARD POOL */}
        {activeStep === 2 && (
          <Card className="p-5 space-y-4 border border-outline-variant/15 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.015)]">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-display text-xs font-black text-primary uppercase tracking-wider">
                {language === "uz" ? "2-QADAM: MUKOFOT VA LIMITLAR" : language === "ru" ? "ШАГ 2: ПРИЗЫ И ЛИМИТЫ" : "STEP 2: REWARDS & ALLOCATION"}
              </h3>
            </div>

            {/* Prize Pool Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">
                {language === "uz" ? "Jami TON mukofoti" : language === "ru" ? "Общий фонд TON" : "Total Prize Stake"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={prizePool}
                  onChange={(e) => setPrizePool(e.target.value)}
                  className="w-full bg-neutral-50 hover:bg-neutral-50 border border-outline-variant/30 focus:border-primary focus:bg-white rounded-xl p-3 pr-16 text-sm font-mono font-black text-neutral-800 outline-none"
                  placeholder="250.0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-display text-xs font-black text-primary uppercase tracking-wider">
                  TON
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-outline/80 font-semibold leading-normal mt-1 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                <span className="flex items-center gap-1">
                  <BadgeDollarSign className="w-3.5 h-3.5 text-primary" />
                  Estimated Market Value:
                </span>
                <span className="font-mono font-bold text-neutral-700">
                  ≈ ${(parseFloat(prizePool || "0") * 5.12).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </span>
              </div>
            </div>

            {/* Winners Count field */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider flex justify-between">
                <span>{language === "uz" ? "G'oliblar ulushlari (N ta)" : language === "ru" ? "Победителей (мест)" : "Distribution Spots"}</span>
                <span className="text-[10px] font-mono text-primary font-black">
                  ≈ {(parseFloat(prizePool || "0") / winnersCount).toFixed(2)} TON / {language === "uz" ? "g'olib" : language === "ru" ? "чел" : "winner"}
                </span>
              </label>
              <div className="flex items-center border border-outline-variant/30 rounded-xl bg-neutral-50/50 overflow-hidden">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="p-3.5 hover:bg-neutral-100 text-neutral-700 active:scale-90 duration-100 cursor-pointer shrink-0 border-r border-outline-variant/20"
                >
                  <Minus className="w-4 h-4 text-primary" />
                </button>
                <div className="flex-1 text-center font-mono font-black text-sm text-neutral-800 select-none">
                  {winnersCount} {language === "uz" ? "talabgor" : language === "ru" ? "победителей" : "winners"}
                </div>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="p-3.5 hover:bg-neutral-100 text-neutral-700 active:scale-90 duration-100 cursor-pointer shrink-0 border-l border-outline-variant/20"
                >
                  <Plus className="w-4 h-4 text-primary" />
                </button>
              </div>
              <p className="text-[10px] text-outline/80 leading-normal font-semibold">
                {language === "uz" ? "Belgilangan miqdor yetakchi g'oliblar orasida teng ulushda taqsimlanadi." : language === "ru" ? "Призовой фонд распределяется в равных частях среди лидеров таблицы заезда." : "All distribution payouts will be split equally among the verified top performers of the race."}
              </p>
            </div>
          </Card>
        )}

        {/* STEP 3: TIMELINE */}
        {activeStep === 3 && (
          <Card className="p-5 space-y-4 border border-outline-variant/15 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.015)]">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <CalendarDays className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-display text-xs font-black text-primary uppercase tracking-wider">
                {language === "uz" ? "3-QADAM: TIMELINE VA START" : language === "ru" ? "ШАГ 3: ХРОНОЛОГИЯ СТАРТА" : "STEP 3: RUNTIME TIMELINE"}
              </h3>
            </div>

            {/* Quick selectors */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">
                {language === "uz" ? "Tezkor muddat sozlagichi" : language === "ru" ? "Быстрая длительность" : "Quick Duration Presets"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 7, 14].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDurationInDays(days)}
                    className="p-2.5 bg-neutral-50 hover:bg-neutral-100 active:scale-[0.98] border border-outline-variant/20 text-[10px] font-black uppercase text-neutral-700 rounded-xl cursor-pointer"
                  >
                    {days} {language === "uz" ? "kun" : language === "ru" ? "дней" : "days"}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">
                  {language === "uz" ? "Boshlanish" : language === "ru" ? "Старт" : "Start Date"}
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-neutral-50 hover:bg-neutral-50 border border-outline-variant/30 focus:border-primary focus:bg-white rounded-xl p-3 text-xs font-mono font-bold text-neutral-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">
                  {language === "uz" ? "Yopilish" : language === "ru" ? "Финиш" : "End Date"}
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-neutral-50 hover:bg-neutral-50 border border-outline-variant/30 focus:border-primary focus:bg-white rounded-xl p-3 text-xs font-mono font-bold text-neutral-800"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2 text-left">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-primary/95 leading-normal font-semibold">
                {language === "uz" ? "Sprint tugashidan oldin mukofot to'lovlarini muddatidan oldin yechib bo'lmaydi. Bu orqali ishtirokchilar ishonchi saqlanadi." : language === "ru" ? "Депозит блокируется смарт-контрактом до официального закрытия гонки заезда." : "Staked pool funds are non-custodial and locked dynamically till the validated race completion date."}
              </p>
            </div>
          </Card>
        )}

      </section>

      {/* Floating Bottom action bar for optimal One-handed Mobile ease */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/95 backdrop-blur-md border-t border-outline-variant/15 z-50 flex flex-col gap-2 shadow-[0_-6px_24px_rgba(0,0,0,0.03)]">
        
        {/* Step controls */}
        <div className="flex items-center justify-between gap-3">
          {activeStep > 1 ? (
            <Button
              variant="secondary"
              onClick={handlePrevStep}
              className="flex-1 py-3 text-xs font-display font-black uppercase tracking-wider rounded-xl cursor-pointer"
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              {language === "uz" ? "Ortga" : language === "ru" ? "Назад" : "Back"}
            </Button>
          ) : null}

          {activeStep < 3 ? (
            <Button
              variant="primary"
              onClick={handleNextStep}
              className="flex-1 py-3 text-xs font-display font-black uppercase tracking-wider rounded-xl shadow-xs cursor-pointer"
              icon={<ChevronRight className="w-4 h-4" />}
            >
              {language === "uz" ? "Davom Etish" : language === "ru" ? "Продолжить" : "Next Step"}
            </Button>
          ) : (
            /* FINAL ACTIONS AT STEP 3 */
            <div className="w-full flex items-center gap-2">
              <Button
                variant="outline"
                isLoading={createMutation.isPending}
                onClick={handleSaveDraft}
                className="flex-1 py-3 text-xs font-display font-black uppercase tracking-wider rounded-xl shrink-0"
              >
                {language === "uz" ? "Qoralama" : language === "ru" ? "В архив" : "Draft"}
              </Button>
              <Button
                variant="primary"
                isLoading={createMutation.isPending}
                onClick={handleLockDeposit}
                className="flex-[2] py-3 text-xs font-display font-black uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#0088cc] to-blue-600 border-none shadow-md text-white font-bold"
                icon={<Zap className="w-4 h-4 fill-current text-white shrink-0" />}
              >
                {language === "uz" ? "Zaxira qilish" : language === "ru" ? "Вложить & Запуск" : "Lock & Deposit"}
              </Button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default CreateSprintPage;
