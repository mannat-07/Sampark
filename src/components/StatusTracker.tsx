import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, CheckCircle2, AlertCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const API_URL = import.meta.env.VITE_API_URL || '';

interface StatusHistory {
  id: string;
  status: string;
  comment: string | null;
  createdAt: string;
}

interface TrackingData {
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
  user?: {
    name: string;
    email: string;
  };
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
  WASTE: '🗑️ Waste Management',
  WATER: '💧 Water Supply',
  ELECTRICITY: '⚡ Electricity',
  DRAINAGE: '🌊 Drainage',
  OTHER: '📋 Other',
};

const priorityLabels: Record<string, string> = {
  LOW: '🟢 Low',
  MEDIUM: '🟡 Medium',
  HIGH: '🔴 High',
};

export default function StatusTracker() {
  const [trackingId, setTrackingId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async () => {
    if (!trackingId.trim()) return;
    
    setIsSearching(true);
    setError(null);
    setTrackingData(null);

    try {
      const response = await fetch(`${API_URL}/api/grievance/track/${trackingId.trim().toUpperCase()}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTrackingData(data.grievance);
      } else {
        setError(data.error || 'Invalid Tracking ID. Please check and try again.');
      }
    } catch (err) {
      console.error('Error tracking grievance:', err);
      setError('Failed to track grievance. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const currentStatus = trackingData?.statuses[0]?.status || 'SUBMITTED';
  const StatusIcon = statusIcons[currentStatus as keyof typeof statusIcons] || AlertCircle;
  const statusColor = statusColors[currentStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-700';

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Enter your tracking ID (e.g., SMPK12345)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            className="h-12 pl-10 uppercase"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        <Button
          onClick={handleTrack}
          disabled={isSearching || !trackingId.trim()}
          className="h-12 px-6 hero-gradient"
        >
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Track'
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {trackingData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tracking ID</p>
                <p className="font-display text-lg font-bold text-foreground">
                  {trackingData.trackingId}
                </p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusColor}`}>
                <StatusIcon className={`w-4 h-4 ${currentStatus === 'IN_PROGRESS' || currentStatus === 'UNDER_REVIEW' ? 'animate-spin' : ''}`} />
                <span className="font-medium text-sm">
                  {statusLabels[currentStatus as keyof typeof statusLabels]}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-2">{trackingData.title}</h3>
              <p className="text-sm text-muted-foreground">{trackingData.description}</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6 p-4 rounded-lg bg-secondary/50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <p className="text-sm font-medium text-foreground">
                  {categoryLabels[trackingData.category] || trackingData.category}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Priority</p>
                <p className="text-sm font-medium text-foreground">
                  {priorityLabels[trackingData.priority] || trackingData.priority}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="text-sm font-medium text-foreground">
                  {trackingData.location}
                </p>
              </div>
            </div>

            {trackingData.images && trackingData.images.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-3">Attached Images</p>
                <div className="grid grid-cols-3 gap-2">
                  {trackingData.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-foreground mb-3">Status Timeline</p>
              <div className="space-y-3">
                {trackingData.statuses.map((update, index) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {statusLabels[update.status as keyof typeof statusLabels] || update.status}
                      </p>
                      {update.comment && (
                        <p className="text-sm text-muted-foreground mt-1">{update.comment}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(update.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
