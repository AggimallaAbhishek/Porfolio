import { motion } from "framer-motion";
import { FileText, FolderKanban, MessageCircle } from "lucide-react";

interface ActivityItem {
  type: "project" | "blog" | "message";
  label: string;
  time: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

const iconMap = {
  project: { Icon: FolderKanban, color: "text-cyan", bg: "bg-cyan/10" },
  blog: { Icon: FileText, color: "text-purple-400", bg: "bg-purple/10" },
  message: { Icon: MessageCircle, color: "text-coral", bg: "bg-coral/10" }
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-sm text-slate-500">No recent activity to show.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="font-display text-base font-semibold text-white">Recent Activity</h2>
      </div>
      <ul className="divide-y divide-white/5">
        {items.map((item, index) => {
          const { Icon, color, bg } = iconMap[item.type];
          return (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition"
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${bg}`}>
                <Icon size={15} className={color} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm text-slate-200">{item.label}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-500">{item.time}</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
