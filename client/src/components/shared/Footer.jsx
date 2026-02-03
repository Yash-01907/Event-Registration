import {
  CalendarDays,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-foreground">
              About CollegeFest
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              The biggest annual celebration of talent, technology, and
              teamwork. Join thousands of students in this exciting event.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/events"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Event Schedule
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Registration Guide
                </Link>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-foreground">
              Contact
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: info@collegefest.edu</p>
              <p>Phone: +1 234 567 8900</p>
              <p>Location: Main Campus</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-center items-center text-sm text-muted-foreground">
          <p>© 2026 CollegeFest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
