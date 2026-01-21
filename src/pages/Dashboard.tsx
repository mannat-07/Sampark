import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "@/components/Navbar";
import GrievanceSection from "@/components/GrievanceSection";
import MyGrievances from "@/components/MyGrievances";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GrievanceSection />
      
      {/* My Grievances Section */}
      <section className="py-24 bg-secondary/20">
        <div className="section-container">
          <MyGrievances />
        </div>
      </section>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Dashboard;
