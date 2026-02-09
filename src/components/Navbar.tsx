import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, User, Sun, Moon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";

const publicLinks = [
  { href: "#home", label: "Home" },
  { href: "#problem", label: "The Problem" },
  { href: "#solution", label: "Solutions" },
  { href: "#features", label: "Features" },
  { href: "#contact", label: "Contact" },
];

interface UserData {
  id: string;
  name: string;
  email: string;
  role?: string;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔐 CHECK AUTH USING COOKIE
  useEffect(() => {
    const checkAuth = async () => {
      const API_URL = import.meta.env.VITE_API_URL || '';
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          setIsLoggedIn(false);
          setUser(null);
          setIsAuthChecking(false);
          return;
        }

        const data = await res.json();
        if (data.user) {
          setIsLoggedIn(true);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch {
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  // 🚪 LOGOUT
  const handleLogout = async () => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      // Clear localStorage (only used for UI state, not auth)
      localStorage.removeItem('user');
      navigate("/");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 will-change-transform ${
        isScrolled 
          ? "bg-white/95 dark:bg-[#00171f]/95 backdrop-blur-xl border-b border-gray-200 dark:border-[#007ea7]/20 shadow-xl py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="section-container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Sampark Logo" className="w-10 h-10 rounded-xl object-contain" />
          <span className="font-display font-bold text-xl text-gray-900 dark:text-white">Sampark</span>
        </Link>

        {/* Desktop Links - Hide during auth check to prevent flash */}
        {!isAuthChecking && (
          <div className="hidden lg:flex items-center gap-2">
            {!isLoggedIn &&
              publicLinks.map((link) => {
                const isActive = location.hash === link.href || (location.hash === '' && link.href === '#home');
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="absolute inset-0 bg-gradient-to-r from-[#007ea7] to-[#00a8e8] rounded-xl shadow-lg"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </motion.a>
                );
              })}

            {isLoggedIn && (
              <>
                <motion.div className="relative">
                  <Link 
                    to="/" 
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === '/' 
                        ? 'text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {location.pathname === '/' && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="absolute inset-0 bg-gradient-to-r from-[#007ea7] to-[#00a8e8] rounded-xl shadow-lg"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">Home</span>
                  </Link>
                </motion.div>
                <motion.div className="relative">
                  <Link
                    to="/dashboard"
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === '/dashboard'
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {location.pathname === '/dashboard' && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="absolute inset-0 bg-gradient-to-r from-[#007ea7] to-[#00a8e8] rounded-xl shadow-lg"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">Submit Grievance</span>
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        )}

        {/* Desktop Right */}
        {!isAuthChecking && (
          <div className="hidden lg:flex items-center gap-4 relative">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10 hover:bg-[#003459]/50 border border-[#007ea7]/20"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-[#00a8e8]" />
            ) : (
              <Moon className="w-5 h-5 text-[#007ea7]" />
            )}
          </Button>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-sm font-semibold text-foreground">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-full gold-gradient font-semibold text-sm"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowUserMenu((p) => !p)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium">{user?.name || "User"}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-14 w-64 bg-card dark:bg-[#003459]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border dark:border-[#007ea7]/20 overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-br from-primary/5 to-primary/10 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-sm font-medium text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        )}

        {/* Mobile Buttons */}
        {!isAuthChecking && (
        <div className="lg:hidden flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10 hover:bg-[#003459]/50 border border-[#007ea7]/20"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-[#00a8e8]" />
            ) : (
              <Moon className="w-5 h-5 text-[#007ea7]" />
            )}
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="text-foreground" /> : <Menu className="text-foreground" />}
          </button>
        </div>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden nav-blur border-t"
          >
            <div className="section-container py-6 flex flex-col gap-4">
              {!isLoggedIn &&
                publicLinks.map((link) => (
                  <a key={link.href} href={link.href}>
                    {link.label}
                  </a>
                ))}

              {!isLoggedIn && (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Sign Up</Link>
                </>
              )}

              {isLoggedIn && (
                <>
                  <Link to="/">Home</Link>
                  <Link to="/dashboard">Submit Grievance</Link>
                  <button onClick={handleLogout}>Logout</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
