import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'info@sampark.org',
    link: 'mailto:info@sampark.org',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+91-123-4567890',
    link: 'tel:+911234567890',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: 'City Municipal Office, Main Road',
    link: '#',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    value: 'Mon-Sat: 9 AM - 6 PM',
    link: null,
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-transparent dark:bg-gradient-to-b dark:from-[#0a1628] dark:to-[#0f2847]">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl" />
      
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            We're Here
            <br />
            <span className="text-gradient">To Help</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or need assistance? Our team is ready to support you.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              {item.link ? (
                <a
                  href={item.link}
                  className="block glass-card-modern rounded-3xl p-8 text-center border-2 border-white/20 dark:border-white/10 hover:border-[#00a8e8]/50 dark:hover:border-[#00a8e8]/30 transition-all duration-300 shadow-2xl hover:shadow-[0_30px_80px_-15px_rgba(0,168,232,0.5)] group relative overflow-hidden card-3d-hover hardware-accelerate"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Animated gradient overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-[#00a8e8]/0 to-[#007ea7]/0 pointer-events-none" 
                    whileHover={{
                      background: 'linear-gradient(135deg, rgba(0,168,232,0.1), rgba(0,126,167,0.1))',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00a8e8]/0 to-[#007ea7]/0 group-hover:from-[#00a8e8]/5 group-hover:to-[#007ea7]/5 transition-all duration-300 rounded-3xl pointer-events-none" />
                  
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#007ea7] to-[#00a8e8] mx-auto mb-5 flex items-center justify-center shadow-xl relative z-10"
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 } 
                    }}
                  >
                    <item.icon className="w-8 h-8 text-white drop-shadow-lg" />
                  </motion.div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2 relative z-10">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 relative z-10">
                    {item.value}
                    {item.link !== '#' && (
                      <ExternalLink className="w-3 h-3" />
                    )}
                  </p>
                </a>
              ) : (
                <div className="glass-card-modern rounded-3xl p-8 text-center border-2 border-white/20 dark:border-white/10 shadow-2xl relative overflow-hidden card-3d-hover hardware-accelerate"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Animated gradient overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-[#00a8e8]/0 to-[#007ea7]/0 pointer-events-none"
                    animate={{
                      background: [
                        'linear-gradient(135deg, rgba(0,168,232,0), rgba(0,126,167,0))',
                        'linear-gradient(135deg, rgba(0,168,232,0.05), rgba(0,126,167,0.05))',
                        'linear-gradient(135deg, rgba(0,168,232,0), rgba(0,126,167,0))',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#007ea7] to-[#00a8e8] mx-auto mb-5 flex items-center justify-center shadow-xl relative z-10 smooth-render"
                    animate={{
                      rotateZ: [0, 5, 0, -5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <item.icon className="w-8 h-8 text-white drop-shadow-lg" />
                  </motion.div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2 relative z-10">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground relative z-10">
                    {item.value}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
