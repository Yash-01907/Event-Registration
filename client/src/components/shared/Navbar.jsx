import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, LogOut } from "lucide-react";
import useAuthStore from "@/store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const isCoordinatorDashboard = location.pathname === "/coordinator-dashboard";
  console.log("Navbar User:", user);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-primary"
        >
          <CalendarDays className="h-6 w-6" />
          <span>UniFest</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/events"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Events
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-4">
                {user.coordinatedEvents &&
                  user.coordinatedEvents.length > 0 &&
                  (isCoordinatorDashboard ? (
                    <Link to="/">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:flex text-xs h-8"
                      >
                        Student View
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/coordinator-dashboard">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:flex text-xs h-8"
                      >
                        Coordinator Mode
                      </Button>
                    </Link>
                  ))}
                {user.role === "FACULTY" && (
                  <Link to="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden sm:flex text-xs h-8"
                    >
                      Faculty Dashboard
                    </Button>
                  </Link>
                )}
                <span className="text-sm font-medium text-white">
                  {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="secondary">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
