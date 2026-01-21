import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, Loader2, XCircle, Eye, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  priority: string;
  images: string[];
  createdAt: string;
  statuses: StatusHistory[];
}

const statusIcons = {
  SUBMITTED: Clock,
  UNDER_REVIEW: Loader2,
  IN_PROGRESS: Loader2,
  RESOLVED: CheckCircle2,
  REJECTED: XCircle,
};

const statusColors = {
  SUBMITTED: 'bg-amber-100 text-amber-700',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-purple-100 text-purple-700',
  RESOLVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const statusLabels = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
};

const categoryLabels: Record<string, string> = {
  POTHOLES: '🚧 Potholes',
  WASTE: '🗑️ Waste',
  WATER: '💧 Water',
  ELECTRICITY: '⚡ Electricity',
  DRAINAGE: '🌊 Drainage',
  OTHER: '📋 Other',
};

const priorityColors: Record<string, string> = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-red-100 text-red-700',
};

export default function MyGrievances() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const response = await fetch(`${API_URL}/api/grievance/my-grievances`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setGrievances(data.grievances);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (grievances.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Grievances Yet</h3>
        <p className="text-muted-foreground">You haven't submitted any grievances.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground">My Grievances</h3>
          <p className="text-muted-foreground">Total: {grievances.length}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {grievances.map((grievance, index) => {
          const currentStatus = grievance.statuses[0]?.status || 'SUBMITTED';
          const StatusIcon = statusIcons[currentStatus as keyof typeof statusIcons];
          const statusColor = statusColors[currentStatus as keyof typeof statusColors];
          const priorityColor = priorityColors[grievance.priority as keyof typeof priorityColors];

          return (
            <motion.div
              key={grievance.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm text-primary font-semibold">
                      {grievance.trackingId}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${priorityColor}`}>
                      {grievance.priority}
                    </span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{grievance.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {grievance.description}
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusColor} ml-4`}>
                  <StatusIcon
                    className={`w-4 h-4 ${
                      currentStatus === 'IN_PROGRESS' || currentStatus === 'UNDER_REVIEW'
                        ? 'animate-spin'
                        : ''
                    }`}
                  />
                  <span className="font-medium text-sm whitespace-nowrap">
                    {statusLabels[currentStatus as keyof typeof statusLabels]}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>{categoryLabels[grievance.category] || grievance.category}</span>
                <span>•</span>
                <span>{grievance.location}</span>
                <span>•</span>
                <span>{new Date(grievance.createdAt).toLocaleDateString()}</span>
              </div>

              {grievance.images && grievance.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {grievance.images.slice(0, 3).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Evidence ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ))}
                  {grievance.images.length > 3 && (
                    <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                      +{grievance.images.length - 3}
                    </div>
                  )}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedGrievance(grievance)}
                className="w-full sm:w-auto"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedGrievance && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedGrievance(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Grievance Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGrievance(null)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tracking ID</p>
                <p className="font-mono font-semibold text-primary">
                  {selectedGrievance.trackingId}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Title</p>
                <p className="font-medium text-foreground">{selectedGrievance.title}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-foreground">{selectedGrievance.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p className="text-foreground">
                    {categoryLabels[selectedGrievance.category]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Priority</p>
                  <p className="text-foreground">{selectedGrievance.priority}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="text-foreground">{selectedGrievance.location}</p>
              </div>

              {selectedGrievance.images && selectedGrievance.images.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Attached Images</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedGrievance.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Evidence ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-3">Status Timeline</p>
                <div className="space-y-3">
                  {selectedGrievance.statuses.map((update, index) => (
                    <div
                      key={update.id}
                      className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {statusLabels[update.status as keyof typeof statusLabels]}
                        </p>
                        {update.comment && (
                          <p className="text-sm text-muted-foreground mt-1">{update.comment}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(update.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
