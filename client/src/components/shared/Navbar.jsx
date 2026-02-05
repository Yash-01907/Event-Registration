import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, LogOut, User, Menu, X, Zap } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isCoordinatorDashboard = location.pathname === "/coordinator-dashboard";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for navbar background opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-cyan-500/20" : "bg-transparent"
      }`}
    >
      {/* Scanning line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo with glitch effect */}
        <Link
          to="/"
          className="flex items-center gap-3 font-heading text-xl font-bold tracking-wider text-white group"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 group-hover:animate-pulse transition-all">
            <Cpu className="h-5 w-5 text-white" />
            {/* Pulse ring on hover */}
            <div className="absolute inset-0 rounded-lg border-2 border-cyan-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
          </div>
          <span className="hidden sm:flex items-baseline gap-1">
            <span
              className="text-cyan-400 text-glow-cyan glitch"
              data-text="TECH"
            >
              TECH
            </span>
            <span className="text-white">FEST</span>
            <span className="text-purple-400 text-sm font-mono ml-1 flicker">
              '26
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        {/* <div className="hidden md:flex items-center gap-8">
          <Link
            to="/events"
            className="relative text-sm font-bold font-mono uppercase tracking-wide text-gray-400 transition-all hover:text-cyan-400 group"
          >
            Events
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full" />
          </Link>
          <a
            href="#tech"
            className="relative text-sm font-bold font-mono uppercase tracking-wide text-gray-400 transition-all hover:text-cyan-400 group"
          >
            Tech
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full" />
          </a>
          <a
            href="#sports"
            className="relative text-sm font-bold font-mono uppercase tracking-wide text-gray-400 transition-all hover:text-emerald-400 group"
          >
            Sports
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all group-hover:w-full" />
          </a>
          <a
            href="#cultural"
            className="relative text-sm font-bold font-mono uppercase tracking-wide text-gray-400 transition-all hover:text-fuchsia-400 group"
          >
            Cultural
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-fuchsia-400 transition-all group-hover:w-full" />
          </a>
        </div> */}

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              {(user.role === "FACULTY" || user.role === "ADMIN") && (
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 font-bold font-mono text-xs uppercase"
                  >
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
                      className="hidden sm:flex text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 font-mono text-xs"
                    >
                      Student View
                    </Button>
                  </Link>
                ) : (
                  <Link to="/coordinator-dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex text-gray-300 hover:text-purple-400 hover:bg-purple-500/10 font-mono text-xs"
                    >
                      Coordinator
                    </Button>
                  </Link>
                ))}

              {user.role === "STUDENT" && (
                <Link to="/my-tickets">
                  <Button className="btn-neon bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold font-mono text-xs uppercase">
                    <Zap className="h-4 w-4 mr-1" />
                    My Tickets
                  </Button>
                </Link>
              )}

              <Link to="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 font-bold font-mono text-xs uppercase"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="btn-neon bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold font-mono text-xs uppercase">
                  <Zap className="h-4 w-4 mr-1" />
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-400 hover:text-cyan-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-cyan-500/10 py-4 px-4 space-y-1">
          <Link
            to="/events"
            className="block text-sm font-bold font-mono uppercase text-gray-400 hover:text-cyan-400 py-3 px-3 rounded-lg hover:bg-cyan-500/10 transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            Events
          </Link>

          {user ? (
            <div className="border-t border-gray-800/50 mt-2 pt-2 space-y-1">
              {(user.role === "FACULTY" || user.role === "ADMIN") && (
                <Link
                  to="/dashboard"
                  className="block text-sm font-bold font-mono uppercase text-gray-300 hover:text-cyan-400 py-3 px-3 rounded-lg hover:bg-cyan-500/10 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              {user.coordinatedEvents &&
                user.coordinatedEvents.length > 0 &&
                (isCoordinatorDashboard ? (
                  <Link
                    to="/"
                    className="block text-sm font-bold font-mono uppercase text-gray-300 hover:text-cyan-400 py-3 px-3 rounded-lg hover:bg-cyan-500/10 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Student View
                  </Link>
                ) : (
                  <Link
                    to="/coordinator-dashboard"
                    className="block text-sm font-bold font-mono uppercase text-purple-400 hover:text-purple-300 py-3 px-3 rounded-lg hover:bg-purple-500/10 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Coordinator View
                  </Link>
                ))}

              {user.role === "STUDENT" && (
                <Link
                  to="/my-tickets"
                  className="block text-sm font-bold font-mono uppercase text-cyan-400 hover:text-cyan-300 py-3 px-3 rounded-lg hover:bg-cyan-500/10 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Tickets
                </Link>
              )}

              <Link
                to="/profile"
                className="block text-sm font-bold font-mono uppercase text-gray-300 hover:text-cyan-400 py-3 px-3 rounded-lg hover:bg-cyan-500/10 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left block text-sm font-bold font-mono uppercase text-red-400 hover:text-red-300 py-3 px-3 rounded-lg hover:bg-red-500/10 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-800/50 mt-2 pt-4 flex flex-col gap-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full text-gray-300 font-mono uppercase"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full btn-neon bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-mono uppercase">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
