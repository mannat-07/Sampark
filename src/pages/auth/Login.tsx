import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    try {
      // Call backend API for authentication
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Store token in cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      console.log('Login response:', data); // Debug log

      if (data.user) {
        // Store user data in localStorage for display purposes
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('User role:', data.user.role); // Debug log
        
        // Check if user is admin based on backend response
        if (data.user.role === 'ADMIN') {
          console.log('Redirecting to admin dashboard'); // Debug log
          localStorage.setItem('isAdmin', 'true');
          navigate('/admin/dashboard');
        } else {
          console.log('Redirecting to user dashboard'); // Debug log
          navigate('/dashboard');
        }
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-[#00171f] dark:via-[#003459] dark:to-[#007ea7] relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-[#007ea7]/20 dark:bg-[#007ea7]/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-[#00a8e8]/20 dark:bg-[#00a8e8]/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/95 dark:bg-[#00171f]/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#007ea7]/20 relative z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#007ea7] dark:hover:text-[#00a8e8] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#007ea7] to-[#00a8e8] mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to SampArk
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Login in to access your dashboard
          </p>
        </motion.div>

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#007ea7] group-focus-within:scale-110 transition-transform" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 dark:border-[#007ea7]/30 bg-white dark:bg-[#003459]/30 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007ea7] focus:border-transparent transition-all"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative group"
          >
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#007ea7] group-focus-within:scale-110 transition-transform" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 dark:border-[#007ea7]/30 bg-white dark:bg-[#003459]/30 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007ea7] focus:border-transparent transition-all"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#007ea7] to-[#00a8e8] hover:from-[#003459] hover:to-[#007ea7] text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Signing in...
              </span>
            ) : (
              'Login In'
            )}
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300"
        >
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-[#007ea7] cursor-pointer hover:underline font-semibold"
          >
            Sign up
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
