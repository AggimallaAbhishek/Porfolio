import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.1 }}
      className="max-w-2xl space-y-4"
    >
      <motion.span
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        className="inline-flex rounded-full border border-cyan/30 bg-cyan/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="font-display text-3xl text-slate-950 sm:text-4xl lg:text-5xl dark:text-white"
      >
        {title}
      </motion.h2>
      <motion.p
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="text-base leading-7 text-slate-700 dark:text-slate-300"
      >
        {description}
      </motion.p>
    </motion.div>
  );
}
