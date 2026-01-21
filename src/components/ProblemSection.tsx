import { motion } from 'framer-motion';
import { AlertTriangle, Users, Eye, Scale } from 'lucide-react';

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
    <section id="problem" className="py-24 bg-secondary/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
            The Challenge
          </span>
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-elevated rounded-2xl p-6 group cursor-default"
            >
              <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
