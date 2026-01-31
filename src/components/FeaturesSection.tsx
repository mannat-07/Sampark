import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, MapPin, BarChart3, Bot, ChevronDown, ChevronUp } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Easy Grievance Submission',
    summary: 'Submit complaints with detailed description and photo evidence.',
    details: 'Fill out a simple form with title, description, category, location, and priority. Upload multiple photos as evidence. Receive a unique tracking ID instantly upon submission for future reference.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MapPin,
    title: 'Real-Time Status Tracking',
    summary: 'Track your complaint status with a unique tracking ID.',
    details: 'Enter your tracking ID to view complete details and status history. See timeline of status changes from submission to resolution with admin comments at each stage.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BarChart3,
    title: 'Admin Dashboard',
    summary: 'Comprehensive dashboard for managing and resolving grievances.',
    details: 'Admins can view all grievances, filter by status and priority, update complaint status with comments, manage users, and view analytics. Full audit trail of all actions.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Bot,
    title: 'AI Chatbot Assistant',
    summary: '24/7 chatbot to guide users and answer common questions.',
    details: 'Interactive chatbot that helps users understand how to submit grievances, track status, and answers frequently asked questions about the platform and process.',
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
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.3 }
      }}
      className="glass-card-modern rounded-3xl overflow-hidden cursor-pointer border-2 border-white/20 dark:border-white/10 hover:border-[#00a8e8]/50 dark:hover:border-[#00a8e8]/30 transition-all duration-300 shadow-xl hover:shadow-2xl group relative"
    >
      {/* Subtle shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="p-8 relative z-10">
        <div className="flex items-start gap-5">
          <motion.div 
            className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-xl relative`}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <feature.icon className="w-10 h-10 text-white drop-shadow-2xl" />
            
            {/* Simplified glow effect */}
            <div
              className="absolute inset-0 rounded-3xl blur-xl opacity-40"
              style={{ background: `linear-gradient(135deg, ${feature.color.includes('blue') ? '#3b82f6' : feature.color.includes('emerald') ? '#10b981' : feature.color.includes('violet') ? '#8b5cf6' : '#f97316'}, transparent)` }}
            />
          </motion.div>
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
    <section id="features" className="py-24 relative overflow-hidden wave-bg bg-transparent dark:bg-gradient-to-b dark:from-[#0a1628] dark:via-[#0f2847] dark:to-[#0a1628]">
      {/* Wave divider */}
      <div className="layered-waves">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" className="text-white dark:text-[#0a1628]" opacity="0.3"></path>
        </svg>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-400/5 rounded-full blur-3xl" />
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
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
