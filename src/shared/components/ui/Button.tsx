import { ReactNode, MouseEvent } from "react";
import { Spinner } from "./Spinner";

interface ButtonProps {
  id?: string;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "danger" | "text" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

export function Button({
  id,
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  icon,
}: ButtonProps) {
  const baseStyle =
    "flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 outline-none select-none active:scale-[0.98] cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-3 text-[14px] leading-[18px]",
    lg: "px-6 py-4 text-base",
  };

  const variantStyles = {
    primary: "bg-primary-container text-white shadow-md active:bg-blue-700",
    success: "bg-emerald-600 text-white shadow-md active:bg-emerald-700",
    secondary: "bg-surface-container text-on-surface hover:bg-surface-container-high",
    outline: "border-2 border-primary-container text-primary-container bg-transparent hover:bg-primary-fixed-dim/10",
    danger: "bg-error text-white hover:bg-red-700 active:bg-red-800",
    text: "bg-transparent text-primary hover:bg-primary-fixed-dim/20 active:bg-primary-fixed-dim/30 shadow-none pointer-events-auto",
  };

  const disabledStyle = "opacity-50 cursor-not-allowed pointer-events-none active:scale-100";

  return (
    <button
      id={id}
      type={type}
      onClick={!disabled && !isLoading ? onClick : undefined}
      disabled={disabled || isLoading}
      className={`
        ${baseStyle}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${disabled || isLoading ? disabledStyle : ""}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" light={variant !== "outline" && variant !== "text" && variant !== "secondary"} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
export default Button;
