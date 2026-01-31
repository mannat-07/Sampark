import { motion, useMotionValue, useTransform } from 'framer-motion';
import { AlertTriangle, Users, Eye, Scale } from 'lucide-react';
import { useState, MouseEvent } from 'react';

const problems = [
  {
    icon: AlertTriangle,
    title: 'Unresolved Issues',
    description: 'Potholes, waste, water supply problems remain unaddressed for months.',
  },
  {
    icon: Users,
    title: 'Citizens Feel Unheard',
    description: 'No clear channel to report problems or track their resolution.',
  },
  {
    icon: Eye,
    title: 'Lack of Transparency',
    description: 'No visibility into how complaints are processed or prioritized.',
  },
  {
    icon: Scale,
    title: 'No Accountability',
    description: 'Officials face no consequences for delayed or ignored complaints.',
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-24 relative overflow-hidden bg-transparent dark:bg-gradient-to-b dark:from-[#0f2847] dark:to-[#1a1f3a]">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/3 dark:bg-blue-400/3 rounded-full blur-2xl" />
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Urban Governance Needs
            <br />
            <span className="text-gradient">A Better Solution</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Urban local bodies struggle with providing accessible channels for citizens 
            to report grievances. This leads to frustration, distrust, and inefficiency.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <ProblemCard key={index} problem={problem} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ problem, index }: { problem: typeof problems[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      className="rounded-3xl p-8 border-2 border-blue-200/50 dark:border-blue-900/30 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl group cursor-default relative overflow-hidden"
    >
      {/* Subtle gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.div 
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-5 shadow-lg relative z-10"
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <problem.icon className="w-8 h-8 text-white" />
      </motion.div>
      
      <h3 className="font-display text-lg font-semibold text-foreground mb-2 relative z-10">
        {problem.title}
      </h3>
      <p className="text-muted-foreground text-sm relative z-10">
        {problem.description}
      </p>
      
      {/* Floating particles */}
      {isHovered && [...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-500 rounded-full"
          initial={{ 
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: 0
          }}
          animate={{
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 1,
            delay: i * 0.2,
            repeat: Infinity
          }}
        />
      ))}
    </motion.div>
  );
}
