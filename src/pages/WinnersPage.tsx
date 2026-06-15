import { useEventWinners, useEventDetails } from "../features/events/hooks/useEvents";
import { useNavigationStore } from "../shared/store/navigationStore";
import { useTranslation } from "../shared/store/localizationStore";
import Card from "../shared/components/ui/Card";
import Badge from "../shared/components/ui/Badge";
import { Spinner } from "../shared/components/ui/Spinner";
import { ArrowLeft, Coins, Award, Sparkles, Trophy, Star, CheckCircle } from "lucide-react";

const AVATAR_WHALE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBGeCIITsB3hIdzQPdGG4m_v4PXGzuELTQoPd3vd_RF196CEjwWGd_YtkXPiGgYKvqMX1eoWVlQRDdwR5P2Kv2aKk5ip5SqkPEtFRR7n5vhh6K_gfH_lMMMJLvOF4bQRtvS3wrwBTzBmjD0MSoc_P2Ka6rByWcuc7QSkQ24G-tLzgSgbyJILqyozdEVvSoaazHVgYGVc1eZETW5TFWuPhe-3l-8ifc-JUZhV4jByamCW_aUCpVWtbJXP_nV1hk6GQaVE6aooIT6Avd_";

const AVATAR_KING =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCRX9nvgEqsP5-lf9K7Z13btuv6a_4d2JqFyT7uGFrN1m0046E36aBf9XKsLaoQOjlIfYmE4301vs9-sDx1i5jovJuYkvmLnTCJmWw4Hiqj8VkmhKUK4ReklwcR64jGbb2aBknp0Nldq71rqSQY0c2ZOj7fWk-1XhtZ5o0pEYCgT6tiOqsv9-VgsTWBOY46FiiYvAlY9z4bbJdHHdiRECC_IgFO12HlwgQmHkGZaTEdVeHFuJtMDYH-oQpSq12jZUOpesskVyuvSWQ6";

const AVATAR_DEGEN =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB3ZArifrEaoOZJZnJhXo7C7PbMhoD2Bm_X1rS88x1iX_Xnq7lLJWCRtarZlrdcIinK31q8Ze_KJKvtvNz-r3y4_wTK5dvRRm4KAZmEv8IiHH7fTtRB9DnSmrfCcWZLRfcBbghBiLJuIPuTm1a9uR1kdkHjhxKc2TqyJzwXVODs9B2a1eCEQUpFfhf7kYWRL_F54pUe1sllHInTQ5tkCVqOtsJep0IrLq5AWwX3pMYh0ZMXFUXOXsGfkjljTvIY6n4HVWTVZXXJyLLQ";

const AVATAR_PLACEHOLDER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAT37cNCl7gcez0tSSmp817lHLb4Xbd4OW_H2ErIZU75iSxIH1lQf-rdJ9Df-lu121nQNJvBlIildl4hVt3_1W4T5Ap1cgXEDFGuvO4wMUClwkmRPQ3ajjp3OIEQTQNBNLC3eRzLoxT5W4Pu8N-Wt1Qj3erwUcALC3ZHa-HiNkRF7HZ2oE-cst7qmj00XGiClaufeyNts-BvL6JEI0O_lcqKMdssngOsjXdHDziJroJSzWhvac1jkdlYB5SNFV_cw6IwWsU-hfyRYd3";

export function WinnersPage() {
  const { selectedEventId, goBack } = useNavigationStore();
  const { data: event } = useEventDetails(selectedEventId);
  const { data: rawWinners, isLoading } = useEventWinners(selectedEventId);
  const { t, language } = useTranslation("winners");

  // Fallback finalized winners lists for high fidelity mockups display
  const winners = (rawWinners && rawWinners.length > 0)
    ? rawWinners
    : [
        { rank: 1, username: "ton_whale", total_xp: 5420, wallet_address: "EQAb...x9F2" },
        { rank: 2, username: "crypto_king", total_xp: 4800, wallet_address: "EQZl...m0P4" },
        { rank: 3, username: "degen_1", total_xp: 4200, wallet_address: "UQDx...k1L8" },
        { rank: 4, username: "user_4", total_xp: 3850, wallet_address: "EQAt...d2B7" },
        { rank: 5, username: "shiba_dev", total_xp: 3700, wallet_address: "UQDx...k1L8" },
        { rank: 6, username: "ton_fan_12", total_xp: 3420, wallet_address: "EQZl...m0P4" },
        { rank: 7, username: "crypto_pioneer", total_xp: 3100, wallet_address: "EQCr...v9R1" },
      ];

  const firstPlace = winners[0] || { username: "ton_whale", total_xp: 5420 };
  const secondPlace = winners[1] || { username: "crypto_king", total_xp: 4800 };
  const thirdPlace = winners[2] || { username: "degen_1", total_xp: 4200 };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[440px]">
        <Spinner size="lg" />
        <p className="mt-4 text-xs font-black text-on-surface-variant uppercase tracking-widest animate-pulse font-display text-center">
          {language === "uz" ? "CHEMPIONLAR NATIJALARI..." : language === "ru" ? "ФОРМИРОВАНИЕ СПИСКА ЧЕМПИОНОВ..." : "RESOLVING CHAMPIONS..."}
        </p>
      </div>
    );
  }

  const poolAmount = event?.total_prize_pool || "250";

  return (
    <div className="space-y-5 pb-32 animate-in fade-in duration-300">
      
      {/* Sleek Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low border border-outline-variant/25 rounded-xl hover:bg-surface-container active:scale-95 duration-150 transition-all cursor-pointer text-xs font-black uppercase tracking-wider text-on-surface"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          <span className="font-display pr-0.5">{language === "uz" ? "Ortga" : language === "ru" ? "Назад" : "Back"}</span>
        </button>
        <span className="font-display text-[10px] font-black uppercase text-on-surface-variant tracking-widest">
          {t("title") || "PODIUM"}
        </span>
      </div>

      {/* Hero finished banner - Modern & High-Contrast Visual style */}
      <section className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-gradient-to-br from-primary-container to-blue-700 text-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)]Center items-center text-center">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <Award className="w-8 h-8 text-yellow-300 animate-pulse mb-3" />
          
          <h2 className="font-display text-xl font-extrabold text-white tracking-tight mb-2 uppercase">
            {language === "uz" ? "Sprint yakunlandi" : language === "ru" ? "Заезд завершен" : "Sprint Concluded"}
          </h2>
          
          <p className="text-[10px] text-white/70 tracking-wider font-extrabold font-display uppercase mb-4">
            {language === "uz" ? "Barcha mukofotlar muvaffaqiyatli tarqatildi" : language === "ru" ? "Все призовые транзакции отправлены" : "Smart contract dispersal successfully finalized"}
          </p>

          <div className="inline-flex items-center gap-1.5 bg-white/95 text-neutral-900 px-4 py-2 rounded-full border border-white/20 shadow-xs">
            <Coins className="w-4 h-4 text-yellow-600 shrink-0" />
            <span className="font-display text-[10px] font-black uppercase tracking-wider leading-none text-on-surface">
              {language === "uz" ? `${poolAmount} TON taqsimlandi` : language === "ru" ? `Распределено ${poolAmount} TON` : `${poolAmount} TON Distributed`}
            </span>
          </div>
        </div>
      </section>

      {/* Premium Minimalist Podium Section */}
      <section className="flex items-end justify-center gap-2 pt-4 pb-3 border-b border-outline-variant/15 relative">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-neutral-100/50 rounded-t-xl" />

        {/* Spot 2: Silver */}
        <div className="flex flex-col items-center w-1/3 min-w-0 relative z-10">
          <div className="relative mb-2.5">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-300 bg-neutral-50 shadow-xs relative">
              <img src={AVATAR_KING} alt={secondPlace.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="absolute -bottom-1.5 -right-1 bg-slate-300 text-[10px] font-black text-slate-800 rounded-full px-1.5 py-0.5 border border-white uppercase tracking-tighter select-none shadow-xs font-mono">
              2nd
            </span>
          </div>
          
          <p className="font-display font-extrabold text-[11px] text-on-surface truncate w-full text-center leading-none">
            {secondPlace.username}
          </p>
          <p className="font-mono text-[9px] font-black text-on-surface-variant uppercase tracking-wider mb-2 mt-1">
            {secondPlace.total_xp} <span className="text-[7px]">XP</span>
          </p>
          
          <div className="w-full h-12 bg-gradient-to-t from-slate-100 to-slate-200/50 rounded-t-2xl flex items-center justify-center border-t border-x border-slate-200/60 shadow-[0_-4px_12px_rgba(0,0,0,0.01)]">
            <span className="font-mono text-slate-400 font-extrabold text-lg tracking-tight">2</span>
          </div>
        </div>

        {/* Spot 1: Gold */}
        <div className="flex flex-col items-center w-1/3 z-20 min-w-0 relative">
          <div className="relative mb-2.5">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg animate-pulse">👑</div>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FFD700] bg-yellow-50/20 shadow-[0_4px_15px_rgba(255,215,0,0.15)] relative">
              <img src={AVATAR_WHALE} alt={firstPlace.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="absolute -bottom-1.5 -right-1 bg-[#FFD700] text-[10px] font-black text-amber-950 rounded-full px-1.5 py-0.5 border border-white uppercase tracking-tighter select-none shadow-xs font-mono">
              1st
            </span>
          </div>
          
          <p className="font-display font-black text-xs text-on-surface truncate w-full text-center leading-none">
            {firstPlace.username}
          </p>
          <p className="font-mono text-[10px] font-black text-primary uppercase tracking-wider mb-2 mt-1 font-mono">
            {firstPlace.total_xp} <span className="text-[7px]">XP</span>
          </p>
          
          <div className="w-full h-18 bg-gradient-to-t from-amber-50 to-amber-100/30 rounded-t-2xl flex items-center justify-center border-t border-x border-amber-200/50 shadow-[0_-6px_15px_rgba(255,215,0,0.04)]">
            <span className="font-mono text-[#D4AF37] font-extrabold text-xl tracking-tight">1</span>
          </div>
        </div>

        {/* Spot 3: Bronze */}
        <div className="flex flex-col items-center w-1/3 min-w-0 relative z-10">
          <div className="relative mb-2.5">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#CD7F32]/50 bg-neutral-50 shadow-xs relative">
              <img src={AVATAR_DEGEN} alt={thirdPlace.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="absolute -bottom-1.5 -right-1 bg-[#CD7F32] text-[10px] font-black text-orange-950 rounded-full px-1.5 py-0.5 border border-white uppercase tracking-tighter select-none shadow-xs font-mono">
              3rd
            </span>
          </div>
          
          <p className="font-display font-extrabold text-[11px] text-on-surface truncate w-full text-center leading-none">
            {thirdPlace.username}
          </p>
          <p className="font-mono text-[9px] font-black text-on-surface-variant uppercase tracking-wider mb-2 mt-1">
            {thirdPlace.total_xp} <span className="text-[7px]">XP</span>
          </p>
          
          <div className="w-full h-10 bg-gradient-to-t from-orange-50/70 to-orange-100/20 rounded-t-2xl flex items-center justify-center border-t border-x border-orange-150/40 shadow-[0_-4px_10px_rgba(0,0,0,0.01)]">
            <span className="font-mono text-[#A0522D] font-extrabold text-base tracking-tight">3</span>
          </div>
        </div>
      </section>

      {/* Runner list details with beautiful minimal styling */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display text-[9px] font-black uppercase text-outline tracking-wider">
            {language === "uz" ? "Navbatdagi g'oliblar (4-10 o'rinlar)" : language === "ru" ? "Призеры (4-е - 10-е места)" : "Runner Ups (4th-10th)"}
          </h3>
          <span className="font-display text-[9px] font-black uppercase text-primary tracking-wider">
            {winners.length - 3} {language === "uz" ? "Ishtirokchi" : language === "ru" ? "Участников" : "Racers"}
          </span>
        </div>

        <div className="space-y-2.5">
          {winners.slice(3, 10).map((racer, idx) => (
            <div 
              key={racer.rank || idx} 
              className="p-3.5 border border-outline-variant/20 rounded-2xl flex items-center justify-between bg-white shadow-[0_4px_15px_rgba(0,0,0,0.01)]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs font-extrabold text-on-surface-variant w-5 text-center shrink-0">
                  #{racer.rank}
                </span>
                
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-outline-variant/15 bg-neutral-100">
                  <img src={AVATAR_PLACEHOLDER} alt={racer.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                
                <div className="min-w-0">
                  <p className="font-display text-xs font-black text-on-surface truncate leading-tight">
                    {racer.username}
                  </p>
                  <p className="text-[9px] text-outline font-semibold tracking-wider uppercase truncate">
                    {racer.wallet_address || "Awaiting"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[10px] font-bold text-on-surface-variant">
                  {racer.total_xp.toLocaleString()} XP
                </span>
                
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full py-1 px-2.5">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span className="font-display text-[9px] font-black uppercase tracking-wider leading-none">
                    {language === "uz" ? "YUBORILDI" : language === "ru" ? "ВЫПЛАЧЕНО" : "PAID"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Participant stats metrics - Elegant Minimalist layout */}
      <div className="bg-surface-container-low border border-outline-variant/35 p-4 text-center rounded-2xl">
        <p className="font-display text-[9px] font-black text-on-surface-variant uppercase tracking-widest block leading-none mb-1.5">
          {language === "uz" ? "Sprint ishtirokchilari umumiy soni" : language === "ru" ? "Общее число участников" : "Total Speedrun Competitors"}
        </p>
        <p className="font-display text-xs text-on-surface font-extrabold uppercase flex items-center justify-center gap-1 font-mono tracking-tight text-neutral-800">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>
            {language === "uz" ? "1,248 poygachilar marraga yetib kelishdi" : language === "ru" ? "1,248 гонщиков дошли до финиша" : "1,248 athletes completed"}
          </span>
        </p>
      </div>

    </div>
  );
}

export default WinnersPage;
