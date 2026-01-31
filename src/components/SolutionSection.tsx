import { motion } from 'framer-motion';
import { Eye, Link2, Bell, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const solutions = [
  {
    icon: Eye,
    title: 'Transparency',
    description: 'Track grievance status in real-time with detailed history and admin comments at every stage.',
    color: 'primary',
  },
  {
    icon: Link2,
    title: 'Traceability',
    description: 'Every grievance gets a unique tracking ID. Complete audit trail of all status changes and updates.',
    color: 'accent',
  },
  {
    icon: Bell,
    title: 'Accountability',
    description: 'Admin dashboard ensures officials track, review, and resolve complaints with proper documentation.',
    color: 'primary',
  },
];

export default function SolutionSection() {
  return (
    <section id="solution" className="py-24 relative overflow-hidden wave-bg bg-transparent dark:bg-gradient-to-b dark:from-[#1a1f3a] dark:via-[#0f2847] dark:to-[#0a1628]">
      {/* Wave divider at top */}
      <div className="layered-waves" style={{ top: 0, transform: 'rotate(180deg)' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" className="text-gray-100 dark:text-[#1a1f3a]" opacity="0.5"></path>
        </svg>
      </div>
      
      {/* Enhanced background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-[#00a8e8]/10 via-[#007ea7]/10 to-cyan-500/10 dark:from-[#00a8e8]/5 dark:via-[#007ea7]/5 dark:to-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-400/5 rounded-full blur-3xl" />
      
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Technology Transforms
            <br />
            <span className="bg-gradient-to-r from-[#007ea7] to-[#00a8e8] bg-clip-text text-transparent">Citizen Services</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sampark leverages modern technology to create a seamless bridge between 
            citizens and their local government.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <SolutionCard key={index} solution={solution} index={index} />
          ))}
        </div>

        {/* Benefits list */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-white/80 dark:bg-[#00171f]/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-[#007ea7]/20 shadow-lg"
        >
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Platform Capabilities
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Web Application',
              'Photo Evidence Upload',
              'AI-Powered Chatbot',
              'Unique Tracking IDs',
              'Real-time Status Updates',
              'Admin Dashboard',
            ].map((capability, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#003459]/50 border border-gray-200 dark:border-[#007ea7]/20 hover:border-[#007ea7] dark:hover:border-[#007ea7]/50 transition-all">
                <CheckCircle className="w-5 h-5 text-[#007ea7] dark:text-[#00a8e8] flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{capability}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SolutionCard({ solution, index }: { solution: typeof solutions[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="relative group"
    >
      <div className="glass-card-modern rounded-3xl p-10 h-full border-2 border-white/20 dark:border-white/10 hover:shadow-2xl hover:border-[#00a8e8] dark:hover:border-[#00a8e8]/80 transition-all duration-300 relative overflow-hidden"
      >

        
        {/* Gradient overlay on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#00a8e8]/0 to-[#007ea7]/0 rounded-3xl"
          animate={{
            background: isHovered 
              ? 'linear-gradient(135deg, rgba(0,168,232,0.15), rgba(0,126,167,0.15))' 
              : 'linear-gradient(135deg, rgba(0,168,232,0), rgba(0,126,167,0))'
          }}
        />
        
        <motion.div 
          className={`w-24 h-24 rounded-3xl mb-8 flex items-center justify-center shadow-xl relative z-10 ${
            solution.color === 'accent' ? 'bg-gradient-to-br from-[#00a8e8] via-[#0096d4] to-[#007ea7]' : 'bg-gradient-to-br from-[#007ea7] via-[#008cc4] to-[#00a8e8]'
          }`}
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <solution.icon className="w-12 h-12 text-white drop-shadow-2xl" />
          
          {/* Pulsing glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl blur-2xl"
            style={{ background: solution.color === 'accent' ? '#00a8e8' : '#007ea7' }}
            animate={{
              opacity: isHovered ? [0.3, 0.7, 0.3] : 0.5
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        
        <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">
          {solution.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">
          {solution.description}
        </p>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-tr-3xl">
          <div className={`absolute top-0 right-0 w-32 h-32 -translate-y-1/2 translate-x-1/2 rounded-full opacity-20 dark:opacity-30 ${
            solution.color === 'accent' ? 'bg-[#00a8e8]' : 'bg-[#007ea7]'
          }`} />
        </div>
      </div>
    </motion.div>
  );
}
