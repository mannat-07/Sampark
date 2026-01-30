import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-[#00171f] dark:via-[#003459] dark:to-[#00171f] py-12 border-t border-gray-200 dark:border-[#007ea7]/20">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007ea7] to-[#00a8e8] flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
              Sampark
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            <a href="#home" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors">
              Home
            </a>
            <a href="#features" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors">
              Features
            </a>
            <a href="#grievance" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors">
              Submit Grievance
            </a>
            <a href="#contact" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors">
              Contact
            </a>
          </nav>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2026 Sampark. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
