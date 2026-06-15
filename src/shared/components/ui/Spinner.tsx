interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  light?: boolean;
}

export function Spinner({ size = "md", light = false }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-4",
  };

  const borderColors = light 
    ? "border-white/30 border-t-white" 
    : "border-primary/30 border-t-primary";

  return (
    <div
      className={`rounded-full animate-spin ${sizeClasses[size]} ${borderColors}`}
      role="status"
    />
  );
}
