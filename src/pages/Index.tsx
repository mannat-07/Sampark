import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import FeaturesSection from '@/components/FeaturesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import AnimatedBackground from '@/components/AnimatedBackground';

const Index = () => {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <ContactSection />
        <Footer />
        <Chatbot />
      </div>
    </div>
  );
};

export default Index;
