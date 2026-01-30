import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Upload, MapPin, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { uploadMultipleImages } from '../lib/cloudinary';
import { getCurrentLocation } from '../lib/geocoding';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface GrievanceFormProps {
  onGrievanceSubmitted?: () => void;
}

export default function GrievanceForm({ onGrievanceSubmitted }: GrievanceFormProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    latitude: '',
    longitude: '',
    priority: 'MEDIUM',
  });

  // Auto-save timer ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringRef = useRef(false);

  // Restore form data on mount
  useEffect(() => {
    const restoreFormData = async () => {
      try {
        isRestoringRef.current = true;
        const response = await fetch(`${API_URL}/api/grievance/form/restore`, {
          credentials: 'include',
        });

        const data = await response.json();

        if (data.success && data.formData) {
          setFormData(data.formData.form || {
            title: '',
            description: '',
            category: '',
            location: '',
            latitude: '',
            longitude: '',
            priority: 'MEDIUM',
          });
          setUploadedImages(data.formData.images || []);
          toast.success('✨ Draft restored!', {
            description: 'Your previous form data has been recovered.',
          });
        }
      } catch (error) {
        console.log('No saved form data found');
      } finally {
        isRestoringRef.current = false;
      }
    };

    restoreFormData();

  }, []);

  // Auto-save form data every 3 seconds
  useEffect(() => {
    // Don't auto-save if we're currently restoring data
    if (isRestoringRef.current) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Only auto-save if there's some data to save
    const hasData = formData.title || formData.description || formData.category || formData.location;
    
    if (!hasData) return;

    // Set new timer for auto-save
    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        await fetch(`${API_URL}/api/grievance/form/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            form: formData,
            images: uploadedImages,
          }),
        });
        console.log('✅ Form auto-saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 3000); // Auto-save after 3 seconds of no changes

    // Cleanup on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData, uploadedImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/grievance/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          latitude: formData.latitude || null,
          longitude: formData.longitude || null,
          images: uploadedImages,
          priority: formData.priority,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTrackingId(data.trackingId);
        
        // Clear the auto-saved form data from cache
        try {
          await fetch(`${API_URL}/api/grievance/form/clear`, {
            method: 'DELETE',
            credentials: 'include',
          });
        } catch (error) {
          console.error('Failed to clear form cache:', error);
        }
        
        // Notify parent component to refresh grievances list
        if (onGrievanceSubmitted) {
          onGrievanceSubmitted();
        }
        
        toast.success('Grievance submitted successfully!');
      } else {
        if (response.status === 401) {
          toast.error('Please login to submit a grievance');
        } else {
          toast.error(data.error || 'Failed to submit grievance');
        }
      }
    } catch (error) {
      toast.error('Failed to submit grievance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    toast.loading('Uploading images...');

    try {
      // Convert FileList to Array
      const fileArray = Array.from(files);
      
      // Upload to Cloudflare
      const results = await uploadMultipleImages(fileArray);
      
      // Filter successful uploads
      const successfulUploads = results.filter(r => r.success && r.url);
      const urls = successfulUploads.map(r => r.url!);
      
      if (urls.length > 0) {
        setUploadedImages((prev) => [...prev, ...urls]);
        toast.dismiss();
        toast.success(`${urls.length} image(s) uploaded successfully`);
      }
      
      // Show errors if any
      const errors = results.filter(r => !r.success);
      if (errors.length > 0) {
        toast.dismiss();
        toast.error(errors[0].error || `${errors.length} image(s) failed to upload`);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Get current location using FREE geocoding
  const handleGetCurrentLocation = async () => {
    toast.loading('Getting your location...');
    
    const result = await getCurrentLocation();
    
    toast.dismiss();
    
    if (result.success && result.coordinates) {
      handleInputChange('latitude', result.coordinates.lat.toString());
      handleInputChange('longitude', result.coordinates.lng.toString());
      
      // Auto-fill address if available
      if (result.address) {
        handleInputChange('location', result.address);
        toast.success('Location detected and address filled!');
      } else {
        toast.success('Location coordinates detected!');
      }
    } else {
      toast.error(result.error || 'Unable to get your location');
    }
  };

  if (trackingId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-3">
          Grievance Submitted!
        </h3>
        <p className="text-muted-foreground mb-6">
          Your tracking ID is:
        </p>
        <div className="inline-block px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 mb-6">
          <span className="font-display text-2xl font-bold text-primary">
            {trackingId}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Save this ID to track the status of your complaint.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setTrackingId(null);
            setFormData({ 
              title: '', 
              description: '', 
              category: '', 
              location: '', 
              latitude: '', 
              longitude: '',
              priority: 'MEDIUM' 
            });
            setUploadedImages([]);
          }}
        >
          Submit Another Grievance
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title / Subject</Label>
        <Input
          id="title"
          placeholder="Brief summary of the issue"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
          className="h-12"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
            required
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="POTHOLES">🚧 Potholes</SelectItem>
              <SelectItem value="WASTE">🗑️ Waste Management</SelectItem>
              <SelectItem value="WATER">💧 Water Supply</SelectItem>
              <SelectItem value="ELECTRICITY">⚡ Electricity</SelectItem>
              <SelectItem value="DRAINAGE">🌊 Drainage</SelectItem>
              <SelectItem value="OTHER">📋 Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => handleInputChange('priority', value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">🟢 Low</SelectItem>
              <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
              <SelectItem value="HIGH">🔴 High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="location"
              placeholder="Enter address or landmark"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
              className="h-12 pl-10"
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleGetCurrentLocation}
            className="h-12 px-4"
            title="Get my current location (FREE - no API key needed)"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
        {formData.latitude && formData.longitude && (
          <p className="text-xs text-muted-foreground">
            📍 Coordinates: {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the issue in detail..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          required
          className="min-h-[120px] resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Upload Images (Optional)</Label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={isUploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`block p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors ${
              isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } text-center`}
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            )}
            <p className="text-sm text-muted-foreground">
              {isUploading ? (
                'Uploading...'
              ) : (
                <>
                  <span className="text-primary font-medium">Click to upload</span> or drag and drop
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Photos (max 10MB each)
            </p>
          </label>
        </div>
        
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {uploadedImages.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-14 text-base gold-gradient border-0 text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Submit Grievance
          </span>
        )}
      </Button>
    </form>
  );
}
