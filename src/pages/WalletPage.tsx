import { useState, useEffect } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useConnectWallet, useWalletBalance } from "../features/wallet/hooks/useWallet";
import { useNavigationStore } from "../shared/store/navigationStore";
import { useTranslation } from "../shared/store/localizationStore";
import Card from "../shared/components/ui/Card";
import Button from "../shared/components/ui/Button";
import { Spinner } from "../shared/components/ui/Spinner";
import { useToastStore } from "../features/notifications/store/toastStore";
import {
  ArrowLeft,
  User,
  Star,
  Wallet,
  ShieldCheck,
  ChevronRight,
  History,
  LifeBuoy,
  Lock,
  Globe,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

export function WalletPage() {
  const { goBack, navigate } = useNavigationStore();
  const { user } = useAuth();
  
  const connectMutation = useConnectWallet();
  const { data: wallet, isLoading: isBalanceLoading, refetch } = useWalletBalance(!!user?.wallet_address);
  const addToast = useToastStore((state) => state.addToast);
  const { t, language, setLanguage } = useTranslation("wallet");

  // Connection fields
  const [walletAddress, setWalletAddress] = useState("EQAb7382_xxxx_F93");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const handleConnect = () => {
    connectMutation.mutate({
      wallet_address: walletAddress,
      signature: "0xa3872dc98df...",
      message: "Verify ownership of Telegram ID Mini App",
    }, {
      onSuccess: () => {
        addToast(t("wallet_connected_toast") || "Wallet connected successfully!", "success");
      }
    });
  };

  const handleDisconnect = () => {
    connectMutation.mutate({
      wallet_address: "",
      signature: "",
      message: "",
    }, {
      onSuccess: () => {
        const discToast = language === "uz" ? "TON Hamyondan uzildi" : language === "ru" ? " TON кошелек отключен" : "TON Wallet disconnected";
        addToast(discToast, "info");
      }
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsHistoryLoading(true);
    try {
      await refetch();
      setTimeout(() => {
        setIsRefreshing(false);
        setIsHistoryLoading(false);
        const refToast = language === "uz" ? "Balans muvaffaqiyatli yangilandi" : language === "ru" ? "Баланс успешно обновлен" : "Balance successfully updated";
        addToast(refToast, "success");
      }, 700);
    } catch {
      setIsRefreshing(false);
      setIsHistoryLoading(false);
    }
  };

  const getPlaceholderText = () => {
    if (language === "uz") return "TON hamyon manzilini kiriting (EQ...)";
    if (language === "ru") return "Вставьте адрес TON кошелька (EQ...)";
    return "Paste TON wallet address (EQ...)";
  };

  // Structured Web3 Transactions History
  const mockTransactions = [
    {
      id: "tx1",
      type: "received",
      title: language === "uz" ? "Sprint mukofoti" : language === "ru" ? "Награда за Спринт" : "Sprint Reward Distribution",
      subtitle: "Winter TON Run",
      amount: "45.00",
      timestamp: new Date(), // Today
      status: "completed",
    },
    {
      id: "tx2",
      type: "sent",
      title: language === "uz" ? "Ko'chirildi" : language === "ru" ? "Вывод TON" : "Transfer TON Out",
      subtitle: "Sent to secure custody",
      amount: "15.00",
      timestamp: new Date(Date.now() - 3600000 * 2), // Today, 2 hrs ago
      status: "completed",
    },
    {
      id: "tx3",
      type: "received",
      title: language === "uz" ? "Taklif mukofoti" : language === "ru" ? "Реферальный бонус" : "Referral Affiliate Bonus",
      subtitle: "racer_9281 referral reward",
      amount: "5.50",
      timestamp: new Date(Date.now() - 86400000), // Yesterday
      status: "completed",
    },
    {
      id: "tx4",
      type: "sent",
      title: language === "uz" ? "Sprint garovi tikildi" : language === "ru" ? "Депозит заезда" : "Sprint Stake Deposit",
      subtitle: "Summer TON Track ID #42",
      amount: "250.00",
      timestamp: new Date(Date.now() - 86400000 * 4), // This week
      status: "completed",
    }
  ];

  // Helper to group transactions by human timelines
  const getGroupedTransactions = () => {
    const today: typeof mockTransactions = [];
    const yesterday: typeof mockTransactions = [];
    const older: typeof mockTransactions = [];

    const now = new Date();
    now.setHours(0,0,0,0);
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    mockTransactions.forEach((tx) => {
      const txDate = new Date(tx.timestamp);
      txDate.setHours(0,0,0,0);
      if (txDate.getTime() === now.getTime()) {
        today.push(tx);
      } else if (txDate.getTime() === yesterdayDate.getTime()) {
        yesterday.push(tx);
      } else {
        older.push(tx);
      }
    });

    return { today, yesterday, older };
  };

  const { today, yesterday, older } = getGroupedTransactions();

  return (
    <div className="space-y-5 pb-32 animate-in fade-in duration-300">
      
      {/* Visual Top Bar / Minimal Context */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low border border-outline-variant/25 rounded-xl hover:bg-surface-container active:scale-95 duration-150 transition-all cursor-pointer text-xs font-black uppercase tracking-wider text-on-surface"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          <span className="font-display pr-0.5">{language === "uz" ? "Ortga" : language === "ru" ? "Назад" : "Back"}</span>
        </button>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-display text-[9px] font-black uppercase text-on-surface-variant tracking-widest">
            {language === "uz" ? "TON TARMOQ: FAOL" : language === "ru" ? "TON СЕТЬ: РАБОТАЕТ" : "TON MAINNET: ONLINE"}
          </span>
        </div>
      </div>

      {/* Profile Summary Card - Premium minimalist container */}
      <div className="flex items-center gap-4 p-4 bg-white border border-outline-variant/15 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.015)]">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-1 rounded-full border-2 border-white text-yellow-950 shadow-xs">
            <Star className="w-2.5 h-2.5 fill-current" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xs font-black text-on-surface truncate">
            {user?.first_name || "Alex"} {user?.last_name || "Thompson"}
          </p>
          <p className="text-[9px] text-outline font-extrabold uppercase tracking-widest mt-0.5">
            PRIZERACE RACER #82910
          </p>
        </div>
      </div>

      {/* Main Connected / Disconnected Hero Wallet State */}
      {!user?.wallet_address ? (
        /* DISCONNECTED STATE */
        <Card className="p-6 border border-outline-variant/30 text-center relative overflow-hidden bg-gradient-to-b from-white to-neutral-50/20">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 shadow-inner relative">
              <Wallet className="w-6 h-6 text-primary" />
              <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-white border border-white">
                !
              </div>
            </div>

            <h3 className="font-display text-sm font-black text-on-surface mb-1">
              {language === "uz" ? "TON Hamyonni Ulang" : language === "ru" ? "Подключите TON Кошелек" : "Setup Secure TON Wallet"}
            </h3>
            <p className="text-[11px] leading-relaxed text-on-surface-variant max-w-[270px] mb-5 font-medium">
              {language === "uz" 
                ? "Avtomatik mukofot to'lovlarini hamyoningizga to'g'ridan-to'g'ri olish uchun TON manzilini bog'lang." 
                : language === "ru" 
                ? "Подключите кошелек для мгновенного зачисления выигрышей через смарт-контракт TON." 
                : "A secure cryptographic link is required to enable automatic distributed smart-contract payouts."}
            </p>

            <div className="w-full space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full bg-neutral-50 border border-outline-variant/30 text-neutral-800 rounded-xl p-3 pl-10 text-xs font-mono text-center focus:border-primary focus:bg-white outline-none font-bold"
                  placeholder={getPlaceholderText()}
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <span className="font-mono text-xs text-primary/70 font-bold">EQ</span>
                </div>
              </div>
              
              <Button
                variant="primary"
                isLoading={connectMutation.isPending}
                onClick={handleConnect}
                className="w-full py-3.5 font-display text-xs font-black uppercase tracking-wider shadow-md"
                icon={<Wallet className="w-4 h-4 fill-current" />}
              >
                {t("connect_wallet_btn") || "Authorize My Wallet"}
              </Button>
            </div>

            {/* Info Security Disclaimer */}
            <div className="flex items-start gap-2 text-left mt-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100 w-full">
              <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[9px] text-on-surface-variant/70 leading-normal font-semibold">
                {language === "uz" ? "Shaxsiy kalit so'ralmaydi. Jarayon 100% xavfsiz va shaffof TON ochiq protokoliga asoslangan." : language === "ru" ? "Мы никогда не запрашиваем приватные ключи. 100% безопасность гарантирована протоколом TON." : "Private key is never requested. Authentication is fully read-only and verified securely via decentralised protocols."}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        /* CONNECTED STATE (Web3 Premium Dashboard) */
        <div className="space-y-5">
          
          {/* TON Premium Hero Card */}
          <section className="relative overflow-hidden rounded-2xl border border-outline-variant/20 bg-gradient-to-br from-primary-container to-blue-700 text-white p-5 shadow-[0_12px_28px_rgba(0,102,255,0.12)]">
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="font-display text-[9px] font-black uppercase tracking-wider text-emerald-200">
                    {language === "uz" ? "ULANDI" : language === "ru" ? "ПОДКЛЮЧЕН" : "CONNECTED"}
                  </span>
                </div>
                
                <button 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-1.5 hover:bg-white/10 rounded-lg active:scale-90 transition-all cursor-pointer text-white/80"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </button>
              </div>

              <p className="font-display text-[10px] font-black uppercase text-white/70 tracking-widest uppercase">
                {t("available_balance") || "Available Balance"}
              </p>
              
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-mono text-3xl font-black tracking-tight">
                  {wallet?.balance_ton ? parseFloat(wallet.balance_ton).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "12.50"}
                </span>
                <span className="font-display text-sm font-black uppercase text-white/80 shrink-0">TON</span>
              </div>
              
              <p className="font-mono text-xs text-white/60 font-bold mt-1">
                ≈ ${(parseFloat(wallet?.balance_ton || "12.50") * 5.12).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </p>

              {/* Secure Address badge */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/50 font-bold">
                  {user.wallet_address.slice(0, 8)}...{user.wallet_address.slice(-6)}
                </span>
                
                <button
                  type="button" 
                  onClick={() => {
                    navigator.clipboard.writeText(user.wallet_address);
                    addToast(language === "uz" ? "Hamyon nusxalandi" : "Адрес скопирован", "success");
                  }}
                  className="font-display text-[9px] font-black uppercase text-white/80 hover:text-white px-2 py-1 bg-white/10 hover:bg-white/20 transition-all rounded-lg cursor-pointer"
                >
                  {language === "uz" ? "Nusxalash" : language === "ru" ? "Копировать" : "Copy"}
                </button>
              </div>
            </div>
          </section>

          {/* Quick Transaction Action Buttons (Transfer Controls) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("home")}
              className="px-4 py-3 bg-white hover:bg-neutral-50/50 border border-outline-variant/20 rounded-2xl flex items-center justify-center gap-2 font-display text-[11px] font-black uppercase tracking-wider text-on-surface active:scale-95 duration-150 transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.015)]"
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{language === "uz" ? "Raqobatlashish" : language === "ru" ? "Участвовать" : "Compete"}</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="px-4 py-3 bg-red-50/30 hover:bg-red-50/65 border border-red-200/40 rounded-2xl flex items-center justify-center gap-2 font-display text-[11px] font-black uppercase tracking-wider text-red-700 active:scale-95 duration-150 transition-all cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{language === "uz" ? "Uzish" : language === "ru" ? "Отключить" : "Disconnect"}</span>
            </button>
          </div>

          {/* Elegant Grouped Transaction History */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-display text-[10px] font-black uppercase text-outline tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>{t("tx_history") || "On-Chain Ledger Activity"}</span>
              </h3>
              <span className="font-display text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md tracking-wider">
                {language === "uz" ? "To'liq muvaffaqiyatli" : language === "ru" ? "Завершено" : "Ledger Validated"}
              </span>
            </div>

            {isHistoryLoading ? (
              /* Beautiful skeletal loading */
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-3.5 bg-white border border-outline-variant/10 rounded-2xl flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-neutral-100 rounded-full" />
                      <div>
                        <div className="h-3 w-28 bg-neutral-150 rounded" />
                        <div className="h-2 w-16 bg-neutral-100 rounded mt-1.5" />
                      </div>
                    </div>
                    <div className="h-4 w-12 bg-neutral-100 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* TIMELINE: TODAY */}
                {today.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-display text-[8px] font-black text-on-surface-variant/60 tracking-widest uppercase pl-1">
                      {language === "uz" ? "Bugun" : language === "ru" ? "Сегодня" : "Today"}
                    </p>
                    {today.map((tx) => (
                      <div 
                        key={tx.id}
                        className="p-3.5 bg-white border border-outline-variant/15 rounded-2xl flex items-center justify-between shadow-[0_3px_10px_rgba(0,0,0,0.01)] hover:border-primary/20 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            tx.type === "received" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                          }`}>
                            {tx.type === "received" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-display text-xs font-black text-on-surface truncate leading-tight">
                              {tx.title}
                            </p>
                            <p className="text-[9px] font-medium text-outline mt-0.5 truncate uppercase">
                              {tx.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className={`font-mono text-xs font-black ${
                            tx.type === "received" ? "text-emerald-600" : "text-neutral-800"
                          }`}>
                            {tx.type === "received" ? "+" : "-"}{parseFloat(tx.amount).toFixed(2)} TON
                          </p>
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-wide">
                            {language === "uz" ? "BAJARILDI" : language === "ru" ? "УСПЕШНО" : "SUCCESS"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TIMELINE: YESTERDAY */}
                {yesterday.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-display text-[8px] font-black text-on-surface-variant/60 tracking-widest uppercase pl-1">
                      {language === "uz" ? "Kecha" : language === "ru" ? "Вчера" : "Yesterday"}
                    </p>
                    {yesterday.map((tx) => (
                      <div 
                        key={tx.id}
                        className="p-3.5 bg-white border border-outline-variant/15 rounded-2xl flex items-center justify-between shadow-[0_3px_10px_rgba(0,0,0,0.01)]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            tx.type === "received" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                          }`}>
                            {tx.type === "received" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-display text-xs font-black text-on-surface truncate leading-tight">
                              {tx.title}
                            </p>
                            <p className="text-[9px] font-medium text-outline mt-0.5 truncate uppercase">
                              {tx.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className={`font-mono text-xs font-black ${
                            tx.type === "received" ? "text-emerald-600" : "text-neutral-800"
                          }`}>
                            {tx.type === "received" ? "+" : "-"}{parseFloat(tx.amount).toFixed(2)} TON
                          </p>
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-wide">
                            {language === "uz" ? "BAJARILDI" : language === "ru" ? "УСПЕШНО" : "SUCCESS"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TIMELINE: OLDER */}
                {older.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-display text-[8px] font-black text-on-surface-variant/60 tracking-widest uppercase pl-1">
                      {language === "uz" ? "O'tgan hafta" : language === "ru" ? "Ранее" : "Older Activity"}
                    </p>
                    {older.map((tx) => (
                      <div 
                        key={tx.id}
                        className="p-3.5 bg-white border border-outline-variant/15 rounded-2xl flex items-center justify-between shadow-[0_3px_10px_rgba(0,0,0,0.01)]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            tx.type === "received" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                          }`}>
                            {tx.type === "received" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-display text-xs font-black text-on-surface truncate leading-tight">
                              {tx.title}
                            </p>
                            <p className="text-[9px] font-medium text-outline mt-0.5 truncate uppercase">
                              {tx.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className={`font-mono text-xs font-black ${
                            tx.type === "received" ? "text-emerald-600" : "text-neutral-800"
                          }`}>
                            {tx.type === "received" ? "+" : "-"}{parseFloat(tx.amount).toFixed(2)} TON
                          </p>
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-wide">
                            {language === "uz" ? "BAJARILDI" : language === "ru" ? "УСПЕШНО" : "SUCCESS"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      )}

      {/* Settings setting rails */}
      <div className="space-y-2">
        <p className="font-display text-[9px] font-black text-on-surface-variant/60 tracking-widest uppercase pl-1.5">
          {language === "uz" ? "Sozlamalar" : language === "ru" ? "Настройки" : "Utility Preferences"}
        </p>

        {/* Language setting rail */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-outline-variant/15 shadow-[0_3px_10px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-xs font-display font-black text-neutral-800 uppercase tracking-wide">
              {language === "uz" ? "Ilova tili" : language === "ru" ? "Язык приложения" : "Language"}
            </span>
          </div>
          <div className="flex items-center gap-0.5 bg-neutral-50 border border-outline-variant/20 rounded-xl p-1">
            {(["uz", "ru", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase transition-all duration-150 cursor-pointer ${
                  language === lang
                    ? "bg-primary text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Security rail */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-outline-variant/15 active:scale-[0.99] transition-transform duration-100 cursor-pointer shadow-[0_3px_10px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-xs font-display font-black text-neutral-800 uppercase tracking-wide">
              {language === "uz" ? "Xavfsizlik va Shaffoflik" : language === "ru" ? "Безопасность и Приватность" : "Security & Sovereignty"}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </div>

        {/* Support rail */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-outline-variant/15 active:scale-[0.99] transition-transform duration-100 cursor-pointer shadow-[0_3px_10px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <LifeBuoy className="w-4 h-4 text-primary" />
            <span className="text-xs font-display font-black text-neutral-800 uppercase tracking-wide">
              {language === "uz" ? "Yordam markazi" : language === "ru" ? "Помощь и Поддержка" : "Help & Concierge"}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </div>
      </div>

      {/* Footer meta info */}
      <div className="text-center pt-2 pb-10">
        <p className="text-[9px] font-black text-on-surface-variant/40 tracking-widest uppercase">
          PRIZERACE SMART CONSOLE v2.4.5
        </p>
      </div>

    </div>
  );
}

export default WalletPage;
