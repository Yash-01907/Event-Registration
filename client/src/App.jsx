import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Landing from '@/pages/Landing';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import ResetPassword from '@/pages/Auth/ResetPassword';
import VerifyEmail from '@/pages/Auth/VerifyEmail';
import ManageEvent from '@/pages/Dashboard/ManageEvent';
import CoordinatorDashboard from '@/pages/Dashboard/CoordinatorDashboard';
import EventRegistrations from '@/pages/Dashboard/EventRegistrations';
import StudentDashboard from '@/pages/Dashboard/StudentDashboard';
import EventDetails from '@/pages/EventDetails';
import Events from '@/pages/Events';
import Profile from '@/pages/Profile';

import FacultyDashboard from '@/pages/Dashboard/FacultyDashboard';
import useAuthStore from '@/store/authStore';
import ScrollToTop from '@/components/shared/ScrollToTop';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <div className='pt-20 text-center'>Loading...</div>;
  if (!user)
    return (
      <div className='pt-20 text-center'>
        Please log in to access this page.
      </div>
    );
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className='pt-20 text-center'>Access Denied</div>;
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
    // ... imports
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <div className='min-h-screen bg-background text-foreground selection:bg-primary/30'>
          <Navbar />
          <main>
            <Routes>
              <Route path='/' element={<Landing />} />
              <Route path='/events' element={<Events />} />
              <Route path='/events/:id' element={<EventDetails />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password' element={<ResetPassword />} />
              <Route path='/verify-email' element={<VerifyEmail />} />
              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                    <FacultyDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/dashboard/event/:id'
                element={
                  <ProtectedRoute
                    allowedRoles={['FACULTY', 'STUDENT', 'ADMIN']}
                  >
                    <ManageEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/coordinator-dashboard'
                element={
                  <ProtectedRoute
                    allowedRoles={['STUDENT', 'FACULTY', 'ADMIN']}
                  >
                    <CoordinatorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/dashboard/event/:id/registrations'
                element={
                  <ProtectedRoute
                    allowedRoles={['STUDENT', 'FACULTY', 'ADMIN']}
                  >
                    <EventRegistrations />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/my-tickets'
                element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/profile'
                element={
                  <ProtectedRoute
                    allowedRoles={['STUDENT', 'FACULTY', 'ADMIN']}
                  >
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <Toaster richColors position='top-right' theme='dark' />
          <Analytics />
        </div>
      </Router>
    </QueryClientProvider>
  );
}
export default App;
