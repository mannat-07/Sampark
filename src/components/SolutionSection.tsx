import { motion } from 'framer-motion';
import { Eye, Link2, Bell, CheckCircle } from 'lucide-react';

const solutions = [
  {
    icon: Eye,
    title: 'Transparency',
    description: 'Public dashboards showing real-time status of all complaints and resolutions across the city.',
    color: 'primary',
  },
  {
    icon: Link2,
    title: 'Traceability',
    description: 'Complete audit trail tracking every step from submission to resolution with timestamps.',
    color: 'accent',
  },
  {
    icon: Bell,
    title: 'Accountability',
    description: 'Automated escalations and notifications ensure responsible officials take timely action.',
    color: 'primary',
  },
];

export default function SolutionSection() {
  return (
    <section id="solution" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            The Solution
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Technology Transforms
            <br />
            <span className="text-gradient">Citizen Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sampark leverages modern technology to create a seamless bridge between 
            citizens and their local government.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative group"
            >
              <div className="card-elevated rounded-3xl p-8 h-full border border-border/50">
                <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center ${
                  solution.color === 'accent' ? 'gold-gradient' : 'hero-gradient'
                }`}>
                  <solution.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {solution.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-tr-3xl">
                  <div className={`absolute top-0 right-0 w-32 h-32 -translate-y-1/2 translate-x-1/2 rounded-full opacity-10 ${
                    solution.color === 'accent' ? 'bg-accent' : 'bg-primary'
                  }`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits list */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-card rounded-2xl p-8"
        >
          <h3 className="font-display text-xl font-bold text-foreground mb-6 text-center">
            Platform Capabilities
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'Web & Mobile Apps',
              'SMS Reporting',
              'AI-Powered Chatbot',
              'Real-time Notifications',
              'Photo/Video Evidence',
              'Analytics Dashboard',
              'Multi-language Support',
              'Offline Capability',
            ].map((capability, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{capability}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
