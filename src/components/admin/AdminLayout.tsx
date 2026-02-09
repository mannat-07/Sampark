import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  BarChart3, 
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/button';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      // Navigate to landing page after logout
      navigate('/');
    }
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/grievances', icon: LayoutDashboard, label: 'Grievances' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#00171f] dark:via-[#003459] dark:to-[#00171f]">
      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#00171f]/80 backdrop-blur-xl border-b border-gray-200 dark:border-[#007ea7]/20"
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <img src="/logo.png" alt="Sampark Logo" className="w-10 h-10 rounded-xl object-contain" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sampark</h1>
                <p className="text-xs text-[#007ea7] dark:text-[#00a8e8]">Admin Portal</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => navigate(item.path)}
                    className={`relative px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                      isActive(item.path)
                        ? 'text-white'
                        : 'text-[#007ea7] dark:text-[#00a8e8] hover:text-gray-900 dark:hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-[#007ea7] to-[#00a8e8] rounded-xl shadow-lg"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="text-sm font-medium relative z-10">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-gray-100 dark:bg-[#003459]/50 border border-gray-200 dark:border-[#007ea7]/20 hover:bg-gray-200 dark:hover:bg-[#003459] transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-[#00a8e8]" />
                ) : (
                  <Moon className="w-5 h-5 text-[#007ea7]" />
                )}
              </motion.button>

              {/* Profile Menu */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-[#003459] dark:to-[#007ea7]/30 border border-gray-200 dark:border-[#007ea7]/20 hover:border-gray-300 dark:hover:border-[#007ea7]/50 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#007ea7] to-[#00a8e8] flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">A</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">Admin User</p>
                    <p className="text-xs text-[#007ea7] dark:text-[#00a8e8]">admin@sampark.com</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#007ea7] dark:text-[#00a8e8] transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#00171f] border border-gray-200 dark:border-[#007ea7]/20 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-[#007ea7]/20">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin User</p>
                        <p className="text-xs text-[#007ea7] dark:text-[#00a8e8]">admin@sampark.com</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-[#003459]/50 border border-gray-200 dark:border-[#007ea7]/20"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#007ea7] dark:text-[#00a8e8]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#007ea7] dark:text-[#00a8e8]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 mt-20"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="lg:hidden fixed right-0 top-20 bottom-0 w-64 bg-white dark:bg-[#00171f] border-l border-gray-200 dark:border-[#007ea7]/20 z-40 overflow-y-auto"
            >
              <div className="p-4 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-[#007ea7] to-[#00a8e8] text-white'
                          : 'text-[#007ea7] dark:text-[#00a8e8] hover:bg-gray-100 dark:hover:bg-[#003459]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="pt-24 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
