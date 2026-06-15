import { ReactNode } from "react";

interface CardProps {
  id?: string;
  children: ReactNode;
  variant?: "default" | "low" | "glass" | "primary" | "borderless";
  className?: string;
  onClick?: () => void;
}

export function Card({ id, children, variant = "default", className = "", onClick }: CardProps) {
  const baseStyle = "rounded-2xl transition-all duration-200 overflow-hidden";

  const variantStyles = {
    default: "bg-surface-container-lowest border border-outline-variant/30 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]",
    low: "bg-surface-container-low border border-outline-variant/25",
    glass: "glass-card border border-white/25 rounded-2xl relative shadow-lg bg-white/20 backdrop-blur-[12px] -webkit-backdrop-blur-[12px]",
    primary: "bg-gradient-to-br from-primary-container to-blue-700 text-white shadow-xl relative",
    borderless: "bg-transparent shadow-none border-none p-0",
  };

  const cursorStyle = onClick ? "cursor-pointer active:scale-[0.99] select-none" : "";

  return (
    <div
      id={id}
      onClick={onClick}
      className={`${baseStyle} ${variantStyles[variant]} ${cursorStyle} ${className}`}
    >
      {children}
    </div>
  );
}
export default Card;
