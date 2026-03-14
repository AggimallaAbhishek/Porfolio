import { motion } from "framer-motion";
import type { BlogPost, Project } from "../../types";

interface OverviewChartsProps {
  projects: Project[];
  posts: BlogPost[];
}

// Very minimal data‑vis: number of posts per month (last 6) + top technologies bar chart
function getLast6Months() {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString("default", { month: "short" }));
  }
  return months;
}

function postsPerMonth(posts: BlogPost[]) {
  const months = getLast6Months();
  const now = new Date();
  return months.map((_, i) => {
    const target = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return posts.filter((p) => {
      if (!p.published_at) return false;
      const d = new Date(p.published_at);
      return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
    }).length;
  });
}

function topTechnologies(projects: Project[], limit = 5) {
  const freq: Record<string, number> = {};
  for (const project of projects) {
    for (const tech of project.tech_stack ?? []) {
      freq[tech] = (freq[tech] ?? 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

export function OverviewCharts({ projects, posts }: OverviewChartsProps) {
  const months = getLast6Months();
  const counts = postsPerMonth(posts);
  const maxCount = Math.max(...counts, 1);
  const techs = topTechnologies(projects);
  const maxTech = Math.max(...techs.map(([, c]) => c), 1);

  const H = 120; // chart height in px
  const W = 100; // chart width %
  const points = counts.map(
    (c, i) =>
      `${(i / (counts.length - 1)) * W},${H - (c / maxCount) * H}`
  );
  const polyline = points.join(" ");

  // Filled area path
  const areaPath = [
    `M ${points[0]}`,
    ...points.slice(1).map((p) => `L ${p}`),
    `L ${W},${H}`,
    `L 0,${H}`,
    "Z"
  ].join(" ");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Area Chart – Blog posts by month */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-6"
      >
        <h2 className="font-display text-sm font-semibold text-white mb-1">Blog Posts Published</h2>
        <p className="text-xs text-slate-500 mb-6">Last 6 months</p>

        <svg
          viewBox={`0 0 100 ${H}`}
          className="w-full"
          preserveAspectRatio="none"
          style={{ height: H }}
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
            <line
              key={frac}
              x1="0"
              x2="100"
              y1={H * frac}
              y2={H * frac}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />
          ))}
          {/* Area fill */}
          <path d={areaPath} fill="url(#areaGrad)" />
          {/* Line */}
          <polyline
            points={polyline}
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Data points */}
          {points.map((pt, i) => {
            const [x, y] = pt.split(",").map(Number);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                fill="#2dd4bf"
                stroke="rgba(3,7,18,1)"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="mt-3 flex justify-between">
          {months.map((m) => (
            <span key={m} className="text-[10px] text-slate-500">{m}</span>
          ))}
        </div>
      </motion.div>

      {/* Bar Chart – Top Technologies */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-6"
      >
        <h2 className="font-display text-sm font-semibold text-white mb-1">Top Technologies</h2>
        <p className="text-xs text-slate-500 mb-6">By project frequency</p>

        {techs.length === 0 ? (
          <p className="text-sm text-slate-500">No technology data yet.</p>
        ) : (
          <div className="space-y-4">
            {techs.map(([name, count], i) => (
              <div key={name}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-slate-300">{name}</span>
                  <span className="text-slate-500">{count} {count === 1 ? "project" : "projects"}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxTech) * 100}%` }}
                    transition={{ delay: i * 0.08 + 0.3, duration: 0.6, ease: "easeOut" }}
                    className="h-2 rounded-full bg-gradient-to-r from-cyan to-purple"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
