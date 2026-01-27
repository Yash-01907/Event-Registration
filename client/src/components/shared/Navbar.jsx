import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Will need to create this or mock it
import { CalendarDays, User } from "lucide-react";

export default function Navbar() {
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
          <Link
            to="/about"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            About
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                Sign In
              </button>
            </Link>
            {/* Placeholder for authenticated user */}
          </div>
        </div>
      </div>
    </nav>
  );
}
