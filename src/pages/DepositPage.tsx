import { useState } from "react";
import { useEventDetails } from "../features/events/hooks/useEvents";
import { useDepositPrizePool } from "../features/wallet/hooks/useWallet";
import { useNavigationStore } from "../shared/store/navigationStore";
import { useTranslation } from "../shared/store/localizationStore";
import Card from "../shared/components/ui/Card";
import Button from "../shared/components/ui/Button";
import Badge from "../shared/components/ui/Badge";
import { Spinner } from "../shared/components/ui/Spinner";
import { useToastStore } from "../features/notifications/store/toastStore";
import {
  ArrowLeft,
  Wallet,
  ShieldCheck,
  HelpCircle,
  Check,
  AlertTriangle,
  KeySquare,
  Copy,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function DepositPage() {
  const { selectedEventId, goBack, navigate } = useNavigationStore();
  const { data: event, isLoading: isEventLoading } = useEventDetails(selectedEventId);
  const depositMutation = useDepositPrizePool();
  const { t, language } = useTranslation("deposit");
  const addToast = useToastStore((state) => state.addToast);

  // States
  const [txHash, setTxHash] = useState("0x4a1e948fc92c2da...8f56");
  const [depositAmount, setDepositAmount] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleOpenConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    
    // Simple validation
    if (!txHash.trim()) {
      addToast(
        language === "uz" ? "Tranzaksiya hashi kerak" : language === "ru" ? "Хэш транзакции обязателен" : "Transaction hash is required",
        "error"
      );
      return;
    }
    
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAndDeposit = () => {
    if (!event) return;
    setIsConfirmModalOpen(false);

    depositMutation.mutate(
      {
        event_id: event.id,
        tx_hash: txHash,
        amount: depositAmount || event.total_prize_pool,
      },
      {
        onSuccess: () => {
          addToast(
            language === "uz" ? "Depozit muvaffaqiyatli qabul qilindi!" : language === "ru" ? "Депозит успешно отправлен!" : "Deposit safely registered!",
            "success"
          );
          setTimeout(() => {
            navigate("home");
          }, 2200);
        },
      }
    );
  };

  if (isEventLoading || !event) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-on-surface-variant animate-pulse font-medium">
          {language === "uz" ? "Mukofot sozlamalari yuklanmoqda..." : language === "ru" ? "Получение конфигурации фонда..." : "Downloading prize config..."}
        </p>
      </div>
    );
  }

  const basePrize = parseFloat(depositAmount || event.total_prize_pool);
  const networkFee = 0.5;
  const requestedTotal = (basePrize + networkFee).toFixed(2);

  return (
    <div className="space-y-5 pb-28 animate-in fade-in duration-300">
      
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
          {language === "uz" ? "DEPOZIT BOSQICHI" : language === "ru" ? "СТАДИЯ ДЕПОЗИТА" : "DEPOSIT PIPELINE"}
        </span>
      </div>

      {/* Steppers indicator */}
      <section className="bg-white border border-outline-variant/15 p-4 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.01)] space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-400">
            <Check className="w-4 h-4" />
          </div>
          <div className="flex-1 h-[2px] bg-emerald-400" />
          <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold ring-4 ring-primary-fixed">
            <Wallet className="w-4 h-4" />
          </div>
          <div className="flex-1 h-[2px] bg-neutral-100" />
          <div className="w-8 h-8 rounded-full border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex justify-between px-1 text-[9px] font-black text-outline uppercase tracking-wider">
          <span>{language === "uz" ? "Sozlash" : language === "ru" ? "Настройка" : "Setup"}</span>
          <span className="text-primary font-black uppercase">PENDING_DEPOSIT</span>
          <span>{language === "uz" ? "Boshlash" : language === "ru" ? "Запуск" : "Launch"}</span>
        </div>
      </section>

      {/* Sprint Card reflect */}
      <Card className="p-4 border border-outline-variant/20 relative overflow-hidden bg-white shadow-[0_4px_12px_rgba(0,0,0,0.015)]">
        <div className="absolute top-4 right-4">
          <Badge variant="xp">⭐ XP</Badge>
        </div>
        <p className="text-[10px] font-black text-outline uppercase tracking-wider">
          {language === "uz" ? "TANLANGAN SPRINT" : language === "ru" ? "ТЕКУЩИЙ ЗАЕЗД" : "TARGET INTENDED SPRINT"}
        </p>
        <h3 className="font-display text-sm font-black text-neutral-800 tracking-tight mt-1">{event.title}</h3>
        
        <div className="flex items-baseline gap-1 mt-3">
          <span className="font-mono text-3xl font-black text-primary">{event.total_prize_pool}</span>
          <span className="font-display text-xs font-black uppercase text-primary/80">TON</span>
        </div>
      </Card>

      {/* Verified state banner display */}
      <section className="space-y-3">
        {depositMutation.isSuccess ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-400/20 flex items-start gap-3 shadow-xs animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-normal font-bold">
              {language === "uz" 
                ? "G'oliblar jamiyati faollashtirildi! Balans muvaffaqiyatli tekshirildi va TON blokcheyn tarmog'ida bloklandi." 
                : language === "ru" 
                ? "Призовой фонд верифицирован и защищен в сети TON." 
                : "Sprint is now officially ACTIVE! The allocated stake was verified and securely locked via TON blockchain contract."}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-400/25 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
            <div className="text-xs leading-normal font-bold">
              {language === "uz" 
                ? "TON o'tkazmasini bajaring, transaksiya kodi (hash)ni nusxalab, quyida tekshirish uchun tasdiqlang." 
                : language === "ru" 
                ? "Пожалуйста, сделайте перевод TON, затем вставьте хэш транзакции для автоматической сверки." 
                : "Transfer the indicated pool amount from your wallet, then copy and paste the reference TX hash below."}
            </div>
          </div>
        )}
      </section>

      {/* Bill summary before submission */}
      <section className="space-y-3 bg-white border border-outline-variant/15 p-4 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-100">
          <HelpCircle className="w-4 h-4 text-primary" />
          <h3 className="font-display text-xs font-black text-neutral-800 uppercase tracking-wide">
            {language === "uz" ? "Moliyalashtirish yo'riqnomasi" : language === "ru" ? "Инструкция оплаты" : "Exchange Bill & Breakdown"}
          </h3>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-neutral-500 uppercase tracking-wide">{language === "uz" ? "Tizimli ulush" : language === "ru" ? "Призовой фонд" : "Prize Allocation"}</span>
            <span className="font-mono font-bold text-neutral-800">{basePrize.toFixed(2)} TON</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-neutral-500 uppercase tracking-wide flex items-center gap-1">
              {language === "uz" ? "Tarmoq xarajatlari" : language === "ru" ? "Верификационная комиссия" : "Verification & Network"}
              <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            </span>
            <span className="font-mono font-bold text-neutral-800">{networkFee.toFixed(2)} TON</span>
          </div>
          
          <div className="pt-2.5 border-t border-dashed border-neutral-200 flex justify-between items-baseline">
            <span className="font-display text-xs font-black text-neutral-800 uppercase tracking-wider">{language === "uz" ? "FAOL JAMI" : "AMOUNT TO SEND"}</span>
            <div className="text-right">
              <span className="font-mono text-xl font-black text-primary leading-none">{requestedTotal} TON</span>
              <p className="text-[9px] font-mono font-bold text-outline mt-0.5">
                ≈ ${(parseFloat(requestedTotal) * 5.12).toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Details inputs */}
      <form onSubmit={handleOpenConfirmation} className="space-y-4">
        
        {/* Transfer amount input */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">
            {language === "uz" ? "Yuborilgan TON miqdori" : language === "ru" ? "Точная сумма перевода" : "Transfer Amount Staked"}
          </label>
          <div className="relative">
            <input
              type="text"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full bg-neutral-50 hover:bg-neutral-50 border border-outline-variant/30 text-neutral-800 rounded-xl p-3 pr-16 text-sm focus:border-primary focus:bg-white outline-none font-mono font-black"
              placeholder={event.total_prize_pool}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-display text-xs font-black text-primary uppercase">TON</span>
          </div>
        </div>

        {/* Transaction hash input */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider">
            {language === "uz" ? "Tranzaksiya hashi (TXID)" : language === "ru" ? "Хэш транзакции (TX Hash)" : "ON-CHAIN TRANSACTION HASH (TXID)"}
          </label>
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="w-full bg-neutral-50 hover:bg-neutral-50 border border-outline-variant/30 text-neutral-800 rounded-xl p-3 text-xs focus:border-primary focus:bg-white font-mono outline-none"
            placeholder="Paste secure TON wallet TX hash reference..."
            required
          />
        </div>

        <Button
          type="submit"
          variant={depositMutation.isSuccess ? "success" : "primary"}
          isLoading={depositMutation.isPending}
          className="w-full font-display text-xs font-black uppercase tracking-wider py-4 mt-2 bg-gradient-to-r from-primary-container to-blue-600 border-none shadow-md text-white"
        >
          {depositMutation.isSuccess 
            ? (language === "uz" ? "Depozit muvaffaqiyatli tasdiqlandi!" : language === "ru" ? "Депозит верифицирован!" : "Verified & Active!") 
            : (language === "uz" ? "Depozitni tekshirish va Start" : language === "ru" ? "Проверить перевод и запустить" : "Verify Deposit & Activate")}
        </Button>
      </form>

      {/* CONFIRMATION OVERLAY MODAL */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-neutral-200/50 shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                <KeySquare className="w-6 h-6 text-primary" />
              </div>

              <h4 className="font-display text-base font-black text-neutral-800 uppercase tracking-tight">
                {language === "uz" ? "O'tkazmani tasdiqlaysizmi?" : language === "ru" ? "Подтверждаете перевод?" : "Confirm Deposit Registry"}
              </h4>
              <p className="text-[11px] leading-relaxed text-neutral-500 mt-1.5 font-medium">
                {language === "uz" 
                  ? "Siz o'tkazma kodi to'g'riligini va ko'rsatilgan miqdorda haqiqiy yuborganingizni tasdiqlaysiz:"
                  : "Double-check that the transaction hash belongs to your connected wallet address:"}
              </p>

              {/* Data break fields */}
              <div className="bg-neutral-50 rounded-2xl p-4 w-full border border-neutral-100 space-y-2 mt-4 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">{language === "uz" ? "SPRINT" : "Sprint title"}</span>
                  <span className="font-bold text-neutral-700 max-w-[200px] truncate">{event.title}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-neutral-200/50">
                  <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">{language === "uz" ? "MIQDOR" : "Amount Staked"}</span>
                  <span className="font-mono font-black text-primary">{requestedTotal} TON</span>
                </div>
                <div className="flex flex-col gap-1 pt-1 border-t border-neutral-200/50">
                  <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">{language === "uz" ? "TRANSAKSIYa HASHI" : "TX Hash"}</span>
                  <span className="font-mono text-[9px] font-bold text-neutral-700 truncate">{txHash}</span>
                </div>
              </div>

              {/* Modal controls */}
              <div className="grid grid-cols-2 gap-3 w-full mt-6">
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="py-3 px-4 bg-neutral-150 hover:bg-neutral-200/50 border border-neutral-200/20 text-neutral-700 font-display text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95"
                >
                  {language === "uz" ? "Tahrirlash" : "Edit"}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndDeposit}
                  className="py-3 px-4 bg-primary text-white font-display text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95 shadow-md shadow-blue-500/10"
                >
                  {language === "uz" ? "Yuborish" : "Confirm"}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default DepositPage;
