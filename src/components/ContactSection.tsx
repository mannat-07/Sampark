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
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Get in Touch
          </span>
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
            >
              {item.link ? (
                <a
                  href={item.link}
                  className="block card-elevated rounded-2xl p-6 text-center group"
                >
                  <div className="w-14 h-14 rounded-xl hero-gradient mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    {item.value}
                    {item.link !== '#' && (
                      <ExternalLink className="w-3 h-3" />
                    )}
                  </p>
                </a>
              ) : (
                <div className="card-elevated rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 rounded-xl hero-gradient mx-auto mb-4 flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
