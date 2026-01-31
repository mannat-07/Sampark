import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CityScene from './CityScene';
import HeroBackground from './HeroBackground';

function LoadingFallback() {
  return (
    <div className="w-full h-[500px] lg:h-[600px] rounded-2xl bg-gradient-to-b from-primary/20 to-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading 3D Scene...</p>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: 'include',
        });
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleSubmitGrievance = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Crazy Three.js Background */}
      <HeroBackground />
      
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] mb-8"
            >
              Your Voice{' '}
              <span className="bg-gradient-to-r from-[#007ea7] via-[#00a8e8] to-[#00c4ff] bg-clip-text text-transparent">
                Matters
              </span>
              <br />
              To Your City
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl leading-relaxed"
            >
              Sampark bridges the gap between citizens and urban local bodies, 
              ensuring transparency, traceability, and accountability in 
              addressing your concerns.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
            >
              <motion.button
                onClick={handleSubmitGrievance}
                className="group relative inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r from-[#007ea7] via-[#00a8e8] to-[#00c4ff] text-white font-bold shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -15px rgba(0,168,232,0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Submit a Grievance</span>
              </motion.button>
              <motion.a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full border-2 border-[#007ea7]/40 dark:border-[#00a8e8]/40 text-gray-900 dark:text-white font-bold hover:bg-[#007ea7]/10 dark:hover:bg-[#00a8e8]/10 hover:border-[#00a8e8] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Features
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right - 3D Scene with decorative elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#00a8e8]/20 to-[#007ea7]/20 rounded-full blur-2xl animate-pulse-slow" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            
            <Suspense fallback={<LoadingFallback />}>
              <CityScene />
            </Suspense>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a
            href="#problem"
            className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors"
          >
            <span className="text-xs font-medium">Scroll to explore</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
