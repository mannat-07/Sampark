import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, MapPin, Calendar, User, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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

interface StatusUpdateModalProps {
  grievance: Grievance | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const statusOptions = [
  { value: 'SUBMITTED', label: 'Submitted', color: 'text-amber-600' },
  { value: 'UNDER_REVIEW', label: 'Under Review', color: 'text-blue-600' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'text-purple-600' },
  { value: 'RESOLVED', label: 'Resolved', color: 'text-green-600' },
  { value: 'REJECTED', label: 'Rejected', color: 'text-red-600' },
];

const categoryLabels: Record<string, string> = {
  POTHOLES: '🚧 Potholes',
  WASTE: '🗑️ Waste Management',
  WATER: '💧 Water Supply',
  ELECTRICITY: '⚡ Electricity',
  DRAINAGE: '🌊 Drainage',
  OTHER: '📋 Other',
};

const StatusUpdateModal = ({ grievance, isOpen, onClose, onUpdate }: StatusUpdateModalProps) => {
  const { toast } = useToast();
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!grievance) return null;

  const currentStatus = grievance.statuses[0]?.status || 'SUBMITTED';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStatus) {
      toast({
        title: 'Error',
        description: 'Please select a status',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/grievances/${grievance.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: newStatus,
          comment: comment.trim() || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Status Updated',
          description: 'Grievance status has been updated successfully',
        });
        onUpdate();
        onClose();
        setNewStatus('');
        setComment('');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Grievance Details</h2>
                  <p className="text-sm text-gray-500 font-mono">{grievance.trackingId}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Grievance Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{grievance.title}</h3>
                      <p className="text-gray-600">{grievance.description}</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{grievance.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Submitted on {new Date(grievance.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>
                        {grievance.user.name} ({grievance.user.email})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>Category: {categoryLabels[grievance.category]}</span>
                    </div>

                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        grievance.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                        grievance.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {grievance.priority} Priority
                      </span>
                    </div>
                  </div>

                  {/* Right Column - Images */}
                  {grievance.images && grievance.images.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ImageIcon className="w-4 h-4 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Attachments</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {grievance.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Attachment ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status History */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Status History</h4>
                  <div className="space-y-3">
                    {grievance.statuses.map((status, index) => (
                      <div
                        key={status.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          index === 0 ? 'bg-purple-600' : 'bg-gray-400'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {status.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(status.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {status.comment && (
                            <p className="text-sm text-gray-600 mt-1">{status.comment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Update Status Form */}
                <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Update Status</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="status">New Status</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              disabled={option.value === currentStatus}
                            >
                              <span className={option.color}>{option.label}</span>
                              {option.value === currentStatus && ' (Current)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="comment">Comment (Optional)</Label>
                      <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment about this status update..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading || !newStatus}>
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Status'
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StatusUpdateModal;
