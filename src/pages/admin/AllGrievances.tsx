import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Loader as LoaderIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import StatusUpdateModal from '@/components/admin/StatusUpdateModal';
import { useToast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || '';

interface StatusHistory {
  id: string;
  status: string;
  comment: string | null;
  createdAt: string;
}

interface Grievance {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  priority: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
  };
  statuses: StatusHistory[];
}

const statusIcons = {
  SUBMITTED: Clock,
  UNDER_REVIEW: LoaderIcon,
  IN_PROGRESS: LoaderIcon,
  RESOLVED: CheckCircle2,
  REJECTED: XCircle,
};

const statusColors: Record<string, string> = {
  SUBMITTED: 'bg-amber-100 text-amber-700 border-amber-200',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-purple-100 text-purple-700 border-purple-200',
  RESOLVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
};

const priorityColors: Record<string, string> = {
  LOW: 'bg-green-100 text-green-700 border-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  HIGH: 'bg-red-100 text-red-700 border-red-200',
};

const categoryLabels: Record<string, string> = {
  POTHOLES: 'Potholes',
  WASTE: 'Waste Management',
  WATER: 'Water Supply',
  ELECTRICITY: 'Electricity',
  DRAINAGE: 'Drainage',
  OTHER: 'Other',
};

const AllGrievances = () => {
  const { toast } = useToast();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [filteredGrievances, setFilteredGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchGrievances();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grievances, searchQuery, statusFilter, categoryFilter, priorityFilter]);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/grievances`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setGrievances(data.grievances);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch grievances');
      }
    } catch (err) {
      console.error('Error fetching grievances:', err);
      setError('Failed to load grievances');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...grievances];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (g) =>
          g.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((g) => g.statuses[0]?.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter((g) => g.category === categoryFilter);
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter((g) => g.priority === priorityFilter);
    }

    setFilteredGrievances(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleStatusUpdate = (grievance: Grievance) => {
    setSelectedGrievance(grievance);
    setShowStatusModal(true);
  };

  const exportToCSV = () => {
    // Simple CSV export
    const headers = ['Tracking ID', 'Title', 'Category', 'Status', 'Priority', 'Location', 'User', 'Created At'];
    const rows = filteredGrievances.map((g) => [
      g.trackingId,
      g.title,
      g.category,
      g.statuses[0]?.status || 'N/A',
      g.priority,
      g.location,
      g.user.name,
      new Date(g.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grievances-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: 'Export Successful',
      description: 'Grievances exported to CSV',
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredGrievances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGrievances = filteredGrievances.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#00a8e8]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 p-6">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Grievances</h1>
            <p className="text-[#007ea7] dark:text-[#00a8e8] mt-1">
              Manage and track all submitted grievances
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline" className="gap-2 bg-white dark:bg-[#003459]/50 border-gray-300 dark:border-[#007ea7]/20 text-[#007ea7] dark:text-[#00a8e8] hover:bg-gray-50 dark:hover:bg-[#003459] hover:text-[#007ea7] dark:hover:text-white">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#00171f]/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#007ea7]/20 p-6 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00a8e8] w-5 h-5" />
                <Input
                  placeholder="Search by ID, title, location, or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-[#003459]/30 border-gray-300 dark:border-[#007ea7]/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-[#007ea7] focus:ring-[#007ea7]"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="POTHOLES">Potholes</SelectItem>
                <SelectItem value="WASTE">Waste</SelectItem>
                <SelectItem value="WATER">Water</SelectItem>
                <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                <SelectItem value="DRAINAGE">Drainage</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priority</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredGrievances.length)} of{' '}
            {filteredGrievances.length} grievances
          </div>
        </motion.div>

        {/* Table */}
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
                    Tracking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-[#00a8e8] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-[#00a8e8] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-[#00a8e8] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-[#00a8e8] uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-[#00a8e8] uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-[#00a8e8] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-[#00a8e8] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#007ea7]/20">
                {currentGrievances.map((grievance, index) => {
                  const currentStatus = grievance.statuses[0];
                  const StatusIcon = statusIcons[currentStatus?.status as keyof typeof statusIcons] || Clock;

                  return (
                    <motion.tr
                      key={grievance.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-blue-50 dark:hover:bg-[#003459]/30 transition-all"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-semibold text-[#00a8e8]">
                          {grievance.trackingId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{grievance.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{grievance.location}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {categoryLabels[grievance.category]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={`flex items-center gap-1 w-fit ${
                            statusColors[currentStatus?.status] || ''
                          }`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {currentStatus?.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={priorityColors[grievance.priority]}
                        >
                          {grievance.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{grievance.user.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{grievance.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {new Date(grievance.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusUpdate(grievance)}
                            className="text-[#00a8e8] hover:text-white hover:bg-[#003459]"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedGrievance(grievance)}
                            className="text-[#007ea7] hover:text-white hover:bg-[#003459]"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 dark:border-[#007ea7]/20 px-6 py-4 flex items-center justify-between bg-white dark:bg-[#003459]/30">
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

      {/* Status Update Modal */}
      <StatusUpdateModal
        grievance={selectedGrievance}
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedGrievance(null);
        }}
        onUpdate={fetchGrievances}
      />
    </>
  );
};

export default AllGrievances;
