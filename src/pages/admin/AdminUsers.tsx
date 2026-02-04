import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Mail,
  Calendar,
  Shield,
  Search,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const API_URL = import.meta.env.VITE_API_URL || '';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  grievanceCount: number;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`${API_URL}/api/admin/users?${params}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#00a8e8]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3 p-6">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-[#007ea7] dark:text-[#00a8e8] mt-1">
            View and manage registered users
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-[#003459]/50 rounded-xl border border-gray-200 dark:border-[#007ea7]/20">
          <Users className="w-5 h-5 text-[#007ea7] dark:text-[#00a8e8]" />
          <div className="text-left">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Users</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalCount}</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#00171f]/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#007ea7]/20 p-6 shadow-lg"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#007ea7] dark:text-[#00a8e8] w-5 h-5" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-10 bg-white dark:bg-[#003459]/30 border-gray-300 dark:border-[#007ea7]/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-[#007ea7] focus:ring-[#007ea7]"
          />
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-[#00171f]/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#007ea7]/20 overflow-hidden shadow-lg"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#003459]/50 border-b border-gray-200 dark:border-[#007ea7]/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-[#00a8e8] uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-[#00a8e8] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-[#00a8e8] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-[#00a8e8] uppercase tracking-wider">
                  Grievances
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-[#00a8e8] uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#007ea7]/20">
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-blue-50 dark:hover:bg-[#003459]/30 transition-all"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#007ea7] to-[#00a8e8] flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FileText className="w-4 h-4" />
                      <span className="font-semibold">{user.grievanceCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 dark:border-[#007ea7]/20 px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-[#003459]/30">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="gap-2 bg-white dark:bg-[#003459]/50 border-gray-300 dark:border-[#007ea7]/20 text-[#007ea7] dark:text-[#00a8e8] hover:bg-gray-100 dark:hover:bg-[#003459] hover:text-gray-900 dark:hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="gap-2 bg-white dark:bg-[#003459]/50 border-gray-300 dark:border-[#007ea7]/20 text-[#007ea7] dark:text-[#00a8e8] hover:bg-gray-100 dark:hover:bg-[#003459] hover:text-gray-900 dark:hover:text-white disabled:opacity-30"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminUsers;
