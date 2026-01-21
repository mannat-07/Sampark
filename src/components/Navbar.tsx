import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

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
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔐 CHECK AUTH USING COOKIE
  useEffect(() => {
    const checkAuth = async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          setIsLoggedIn(false);
          setUser(null);
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
      }
    };

    checkAuth();
  }, [location.pathname]);

  // 🚪 LOGOUT
  const handleLogout = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "nav-blur py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="section-container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">Sampark</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {!isLoggedIn &&
            publicLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {link.label}
              </a>
            ))}

          {isLoggedIn && (
            <>
              <Link to="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-sm font-medium hover:text-primary"
              >
                Submit Grievance
              </Link>
            </>
          )}
        </div>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-4 relative">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-sm font-semibold">
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
                <div className="absolute right-0 top-14 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-br from-primary/5 to-primary/10 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
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

        {/* Mobile Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
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
    </motion.nav>
  );
};

export default Navbar;
