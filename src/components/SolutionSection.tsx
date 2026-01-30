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
    <section id="solution" className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50 dark:from-[#00171f] dark:to-[#003459]">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#007ea7]/10 dark:bg-[#007ea7]/5 rounded-full blur-3xl" />
      
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 dark:bg-[#007ea7]/10 text-primary dark:text-[#00a8e8] text-sm font-medium mb-4">
            The Solution
          </span>
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative group"
            >
              <div className="bg-white dark:bg-gradient-to-br dark:from-[#003459] dark:to-[#00171f] rounded-3xl p-8 h-full border border-gray-200 dark:border-[#007ea7]/30 shadow-lg hover:shadow-xl dark:shadow-[#007ea7]/10 hover:border-[#007ea7] dark:hover:border-[#007ea7]/50 transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-lg ${
                  solution.color === 'accent' ? 'bg-gradient-to-br from-[#00a8e8] to-[#007ea7]' : 'bg-gradient-to-br from-[#007ea7] to-[#00a8e8]'
                }`}>
                  <solution.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {solution.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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
