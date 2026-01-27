import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Landing from "@/pages/Landing";
import Login from "@/pages/Auth/Login";
import FacultyDashboard from "@/pages/Dashboard/FacultyDashboard";

import useAuthStore from "@/store/authStore";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <div className="pt-20 text-center">Loading...</div>;
  if (!user)
    return (
      <div className="pt-20 text-center">
        Please log in to access this page.
      </div>
    );
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="pt-20 text-center">Access Denied</div>;
  }

  return children;
};

const queryClient = new QueryClient();

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/events"
                element={
                  <div className="pt-20 text-center">
                    Events Page (Coming Soon)
                  </div>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["FACULTY"]}>
                    <FacultyDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
export default App;
