import { Shield, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-[#00171f] dark:via-[#003459] dark:to-[#00171f] py-8 border-t border-gray-200 dark:border-[#007ea7]/20">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="Sampark Logo" className="w-8 h-8 rounded-lg object-contain" />
              <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
                Sampark
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
              Bridging citizens and local bodies through transparency.
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#003459]/50 flex items-center justify-center hover:bg-[#007ea7] hover:text-white dark:hover:bg-[#00a8e8] transition-all">
                <Twitter className="w-3 h-3" />
              </a>
              <a href="#" className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#003459]/50 flex items-center justify-center hover:bg-[#007ea7] hover:text-white dark:hover:bg-[#00a8e8] transition-all">
                <Github className="w-3 h-3" />
              </a>
              <a href="#" className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#003459]/50 flex items-center justify-center hover:bg-[#007ea7] hover:text-white dark:hover:bg-[#00a8e8] transition-all">
                <Linkedin className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Quick Links</h3>
            <ul className="space-y-1.5">
              <li><a href="#home" className="text-xs text-gray-600 dark:text-gray-300 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors">Home</a></li>
              <li><a href="#features" className="text-xs text-gray-600 dark:text-gray-300 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors">Features</a></li>
              <li><a href="#contact" className="text-xs text-gray-600 dark:text-gray-300 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Services</h3>
            <ul className="space-y-1.5">
              <li><Link to="/dashboard" className="text-xs text-gray-600 dark:text-gray-300 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors">Submit Grievance</Link></li>
              <li><Link to="/dashboard" className="text-xs text-gray-600 dark:text-gray-300 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors">Track Status</Link></li>
              <li><Link to="/login" className="text-xs text-gray-600 dark:text-gray-300 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Contact</h3>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-2">
              <Mail className="w-3 h-3 text-[#007ea7] dark:text-[#00a8e8]" />
              info@sampark.org
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-gray-200 dark:border-[#007ea7]/20 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-gray-500 dark:text-gray-400">
            © 2026 Sampark. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
