import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const API_URL = import.meta.env.VITE_API_URL || '';

interface DashboardStats {
  total: number;
  submitted: number;
  underReview: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  totalUsers: number;
  recentGrievances: Array<{
    id: string;
    trackingId: string;
    title: string;
    category: string;
    status: string;
    priority: string;
    createdAt: string;
    user: {
      name: string;
    };
  }>;
}

const statusColors: Record<string, string> = {
  SUBMITTED: 'bg-amber-100 text-amber-700 border-amber-200',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-purple-100 text-purple-700 border-purple-200',
  RESOLVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
};

const priorityColors: Record<string, string> = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-red-100 text-red-700',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndFetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthAndFetchStats = async () => {
    try {
      setLoading(true);
      
      // Check admin authentication
      const authResponse = await fetch(`${API_URL}/api/auth/me`, {
        credentials: 'include',
      });

      if (!authResponse.ok) {
        navigate('/login');
        return;
      }

      const authData = await authResponse.json();
      
      // Verify admin role
      if (authData.user?.role !== 'ADMIN') {
        navigate('/login');
        return;
      }

      // Fetch dashboard stats
      const statsResponse = await fetch(`${API_URL}/api/admin/dashboard/stats`, {
        credentials: 'include',
      });

      const data = await statsResponse.json();

      if (statsResponse.ok && data.success) {
        setStats(data.stats);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#00a8e8]" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 p-6">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-700">{error || 'Failed to load dashboard'}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Grievances',
      value: stats.total,
      icon: FileText,
      color: 'from-[#007ea7] to-[#00a8e8]',
      trend: '+12% from last month',
    },
    {
      title: 'Pending Review',
      value: stats.submitted + stats.underReview,
      icon: Clock,
      color: 'from-[#003459] to-[#007ea7]',
      trend: 'Needs attention',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: TrendingUp,
      color: 'from-[#00a8e8] to-[#007ea7]',
      trend: 'Being resolved',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle2,
      color: 'from-green-600 to-green-400',
      trend: `${Math.round((stats.resolved / stats.total) * 100)}% resolution rate`,
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: AlertCircle,
      color: 'from-red-600 to-red-400',
      trend: 'Invalid or duplicate',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-[#007ea7] to-[#003459]',
      trend: 'Active citizens',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-transparent">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-[#007ea7] dark:text-[#00a8e8] mt-1">Welcome to Sampark Admin Portal</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white dark:bg-[#00171f]/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#007ea7]/20 p-6 hover:border-[#007ea7] dark:hover:border-[#007ea7]/50 transition-all cursor-pointer shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#007ea7] dark:text-[#00a8e8]">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{stat.trend}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} rounded-xl p-3 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Status Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-[#00171f]/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#007ea7]/20 p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#007ea7] dark:text-[#00a8e8]">{stats.submitted}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Submitted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#007ea7]">{stats.underReview}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Under Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#00a8e8]">{stats.inProgress}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Rejected</div>
          </div>
        </div>
      </motion.div>

      {/* Recent Grievances */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-[#00171f]/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#007ea7]/20 p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Grievances</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/grievances')}
            className="gap-2 text-[#00a8e8] hover:text-white"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {stats.recentGrievances.map((grievance, index) => (
            <motion.div
              key={grievance.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-[#007ea7]/20 rounded-xl hover:bg-blue-50 dark:hover:bg-[#003459]/30 hover:border-[#007ea7] dark:hover:border-[#007ea7]/50 transition-all cursor-pointer"
              onClick={() => navigate('/admin/grievances')}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-sm font-semibold text-[#00a8e8]">
                    {grievance.trackingId}
                  </span>
                  <Badge variant="outline" className={statusColors[grievance.status]}>
                    {grievance.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={priorityColors[grievance.priority]}>
                    {grievance.priority}
                  </Badge>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{grievance.title}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span>{grievance.category}</span>
                  <span>•</span>
                  <span>By {grievance.user.name}</span>
                  <span>•</span>
                  <span>{new Date(grievance.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#007ea7]" />
            </motion.div>
          ))}
          
          {stats.recentGrievances.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 text-[#007ea7]" />
              <p>No recent grievances</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
