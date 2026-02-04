import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const API_URL = import.meta.env.VITE_API_URL || '';
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: 'include',
        });

        if (!res.ok) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log('AdminRoute - User data:', data); // Debug log
        if (data.user && data.user.role === 'ADMIN') {
          console.log('AdminRoute - Access granted'); // Debug log
          setIsAdmin(true);
        } else {
          console.log('AdminRoute - Access denied, role:', data.user?.role); // Debug log
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#00171f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#007ea7] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
