import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  accentColor?: "cyan" | "coral" | "purple" | "emerald";
  delay?: number;
}

const accentMap = {
  cyan: {
    icon: "text-cyan",
    bg: "bg-cyan/10",
    border: "border-cyan/20",
    glow: "shadow-cyan/10"
  },
  coral: {
    icon: "text-coral",
    bg: "bg-coral/10",
    border: "border-coral/20",
    glow: "shadow-coral/10"
  },
  purple: {
    icon: "text-purple-400",
    bg: "bg-purple/10",
    border: "border-purple/20",
    glow: "shadow-purple/10"
  },
  emerald: {
    icon: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/10"
  }
};

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  accentColor = "cyan",
  delay = 0
}: StatsCardProps) {
  const accent = accentMap[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className={`glass-card flex flex-col gap-5 p-6 shadow-lg ${accent.glow} border ${accent.border}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accent.bg}`}>
          <Icon size={18} className={accent.icon} />
        </span>
      </div>

      <div>
        <p className="font-display text-4xl font-bold text-white">{value}</p>
        {trend && (
          <p className={`mt-2 text-xs font-medium ${trend.positive ? "text-emerald-400" : "text-rose-400"}`}>
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% vs last month
          </p>
        )}
      </div>
    </motion.div>
  );
}
