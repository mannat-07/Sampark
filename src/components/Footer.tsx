import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="hero-gradient py-12">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Sampark
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            <a href="#home" className="text-sm text-white/70 hover:text-white transition-colors">
              Home
            </a>
            <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">
              Features
            </a>
            <a href="#grievance" className="text-sm text-white/70 hover:text-white transition-colors">
              Submit Grievance
            </a>
            <a href="#contact" className="text-sm text-white/70 hover:text-white transition-colors">
              Contact
            </a>
          </nav>

          <p className="text-sm text-white/60">
            © 2026 Sampark. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
