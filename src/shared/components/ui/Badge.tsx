import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "active" | "draft" | "pending" | "finished" | "claimed" | "xp";
  className?: string;
}

export function Badge({ children, variant = "draft", className = "" }: BadgeProps) {
  const baseStyle =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border";

  const variantStyles = {
    active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    draft: "bg-surface-variant text-on-surface-variant border-outline-variant/50",
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    finished: "bg-surface-dim/30 text-on-surface-variant border-outline-variant/30 grayscale",
    claimed: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
    xp: "bg-[#FFD700] text-on-primary border-none shadow-sm font-label-md shrink-0 py-0.5 px-2 font-black",
  };

  return (
    <span className={`${baseStyle} ${variantStyles[variant]} ${className}`}>
      {variant === "active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      )}
      {children}
    </span>
  );
}
export default Badge;
