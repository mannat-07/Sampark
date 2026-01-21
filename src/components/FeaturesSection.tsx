import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, MapPin, BarChart3, Bot, ChevronDown, ChevronUp } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Easy Grievance Reporting',
    summary: 'Submit complaints via web, app, or SMS with photo/video evidence.',
    details: 'Our multi-channel approach ensures every citizen can report issues regardless of their technical expertise. Upload media, describe the issue, and receive instant confirmation with a unique tracking ID.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    summary: "Track your complaint's status with a unique ID.",
    details: 'Receive real-time updates via email and SMS. View a complete timeline of actions taken on your complaint, from submission to resolution.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    summary: 'View city-wide issue trends and resolutions.',
    details: 'Interactive charts and maps showing resolution rates by category, area, and time period. Helps identify recurring issues and measure government performance.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Bot,
    title: 'AI-Powered Assistance',
    summary: 'Chatbots to guide users and prioritize urgent issues.',
    details: '24/7 AI support with natural language processing. The system automatically categorizes and prioritizes complaints based on urgency and impact.',
    color: 'from-orange-500 to-amber-500',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="card-elevated rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            <feature.icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </div>
            <p className="text-muted-foreground text-sm">
              {feature.summary}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-border">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.details}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need
            <br />
            <span className="text-gradient">To Be Heard</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sampark provides a comprehensive suite of tools designed to make 
            civic engagement simple and effective.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
