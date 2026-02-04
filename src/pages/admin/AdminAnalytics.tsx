import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

interface MonthlyData {
  month: string;
  total: number;
  resolved: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface StatusData {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyData[]>([]);
  const [avgResolutionTime, setAvgResolutionTime] = useState(0);
  const [resolutionRate, setResolutionRate] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/dashboard/stats`, {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        // Process data for charts
        const stats = data.stats;
        
        // Set real metrics
        setAvgResolutionTime(stats.averageResolutionDays || 0);
        setResolutionRate(parseFloat(stats.resolutionRate) || 0);
        setTotalUsers(stats.totalUsers || 0);
        
        // Category breakdown
        setCategoryData([
          { name: 'Potholes', value: stats.categoryBreakdown?.POTHOLES || 0, color: '#007ea7' },
          { name: 'Waste', value: stats.categoryBreakdown?.WASTE || 0, color: '#00a8e8' },
          { name: 'Water', value: stats.categoryBreakdown?.WATER || 0, color: '#003459' },
          { name: 'Electricity', value: stats.categoryBreakdown?.ELECTRICITY || 0, color: '#00c2ff' },
          { name: 'Drainage', value: stats.categoryBreakdown?.DRAINAGE || 0, color: '#0088cc' },
          { name: 'Other', value: stats.categoryBreakdown?.OTHER || 0, color: '#005577' },
        ]);

        // Status data
        setStatusData([
          { label: 'Submitted', value: stats.submitted, icon: Clock, color: 'text-amber-600' },
          { label: 'Under Review', value: stats.underReview, icon: AlertCircle, color: 'text-blue-600' },
          { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'text-purple-600' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-green-600' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600' },
        ]);

        // Monthly trend
        setMonthlyTrend(stats.monthlyTrend || []);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const maxCategoryValue = Math.max(...categoryData.map(d => d.value), 1);
  const maxMonthlyValue = Math.max(...monthlyTrend.map(d => d.total), 1);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detailed insights and performance metrics
          </p>
        </div>
        
        {/* Time Range Selector */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-[#003459]/50 border border-gray-300 dark:border-[#007ea7]/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007ea7]"
        >
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </motion.div>

      {/* Status Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {statusData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-[#00171f]/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#007ea7]/20 p-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#00171f]/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#007ea7]/20 p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-[#007ea7] dark:text-[#00a8e8]" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Category Breakdown</h2>
          </div>

          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{category.value}</span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-[#003459]/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(category.value / maxCategoryValue) * 100}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#00171f]/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#007ea7]/20 p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-[#007ea7] dark:text-[#00a8e8]" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Trend</h2>
          </div>

          <div className="space-y-3">
            {monthlyTrend.map((month, index) => (
              <div key={month.month}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{month.month}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Resolved: {month.resolved}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{month.total}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-[#003459]/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(month.total / maxMonthlyValue) * 100}%` }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-[#007ea7] to-[#00a8e8] rounded-full"
                    />
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-[#003459]/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(month.resolved / maxMonthlyValue) * 100}%` }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Average Resolution Time */}
        <div className="bg-white dark:bg-[#00171f]/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#007ea7]/20 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#007ea7] to-[#00a8e8] flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Resolution Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {avgResolutionTime > 0 ? `${avgResolutionTime.toFixed(1)} days` : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Based on resolved cases</span>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-white dark:bg-[#00171f]/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#007ea7]/20 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{resolutionRate.toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Of all grievances</span>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white dark:bg-[#00171f]/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#007ea7]/20 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>Registered users</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
