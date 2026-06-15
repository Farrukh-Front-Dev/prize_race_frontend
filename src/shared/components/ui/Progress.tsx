interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
  color?: string;
}

export function Progress({ value, className = "", color = "bg-primary" }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden ${className}`}>
      <div
        className={`${color} h-full rounded-full transition-all duration-300`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
export default Progress;
