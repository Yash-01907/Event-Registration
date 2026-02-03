import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, LogOut, User } from "lucide-react";
import useAuthStore from "@/store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isCoordinatorDashboard = location.pathname === "/coordinator-dashboard";

  // Function to handle scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-foreground"
        >
          <CalendarDays className="h-6 w-6" />
          <span>CollegeFest 2026</span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("tech")}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Techfest
            </button>
            <button
              onClick={() => scrollToSection("sports")}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Sports
            </button>
            <button
              onClick={() => scrollToSection("cultural")}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Cultural
            </button>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-4">
                {(user.role === "FACULTY" || user.role === "ADMIN") && (
                  <Link to="/dashboard">
                    <Button variant="ghost" className="font-medium">
                      Dashboard
                    </Button>
                  </Link>
                )}

                {user.coordinatedEvents &&
                  user.coordinatedEvents.length > 0 &&
                  (isCoordinatorDashboard ? (
                    <Link to="/">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex"
                      >
                        Student View
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/coordinator-dashboard">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex"
                      >
                        Coordinator Mode
                      </Button>
                    </Link>
                  ))}

                {user.role === "STUDENT" && (
                  <Link to="/my-tickets">
                    <Button className="font-medium">My Registrations</Button>
                  </Link>
                )}

                <Link to="/profile">
                  <Button variant="ghost" size="icon" title="Profile">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="font-medium">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="font-medium">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
