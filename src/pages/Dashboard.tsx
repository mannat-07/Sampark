import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "@/components/Navbar";
import GrievanceSection from "@/components/GrievanceSection";
import MyGrievances from "@/components/MyGrievances";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const myGrievancesRef = useRef<{ refresh: () => void }>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include", // 🔥 IMPORTANT
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        // If user is admin, redirect to admin dashboard
        if (data.user && data.user.role === 'ADMIN') {
          console.log('Admin user detected, redirecting to admin dashboard');
          navigate("/admin/dashboard");
          return;
        }
      } catch (error) {
        navigate("/login");
      }
    };

    checkAuth();

    // Optional scroll to grievance section
    const el = document.getElementById("grievance");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [navigate]);

  const handleGrievanceSubmitted = () => {
    // Refresh the grievances list when a new grievance is submitted
    if (myGrievancesRef.current) {
      myGrievancesRef.current.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GrievanceSection onGrievanceSubmitted={handleGrievanceSubmitted} />
      
      {/* My Grievances Section */}
      <section className="py-24 bg-secondary/20">
        <div className="section-container">
          <MyGrievances ref={myGrievancesRef} />
        </div>
      </section>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Dashboard;
