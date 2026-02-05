import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { useDebounce } from "@/hooks/useDebounce";
import useAuthStore from "@/store/authStore";
import { cn } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Users,
  Loader2,
  Search,
  ArrowRight,
  Cpu,
  Zap,
  Trophy,
  Music,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// Countdown Timer Component
function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINS", value: timeLeft.minutes },
    { label: "SECS", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-3 sm:gap-4">
          <div className="countdown-box rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[80px] text-center">
            <div className="text-2xl sm:text-4xl font-bold font-heading text-cyan-400 text-glow-cyan">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 font-mono mt-1">
              {unit.label}
            </div>
          </div>
          {index < timeUnits.length - 1 && (
            <span className="text-2xl sm:text-3xl font-bold text-gray-700 animate-pulse">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// Floating Particles Component
function FloatingParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 10}s`,
      size: 2 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

// Typing Text Component
function TypingText({ text }) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <span className="font-mono">
      {displayText}
      <span className="animate-pulse text-cyan-400">|</span>
    </span>
  );
}

export default function Landing() {
  const { data: events, isLoading, error } = useEvents();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // TechFest date - February 25, 2026
  const techFestDate = "2026-02-25T09:00:00";

  const categories = [
    { id: "ALL", label: "All Events", icon: Zap },
    { id: "TECH", label: "Tech", icon: Cpu },
    { id: "SPORTS", label: "Sports", icon: Trophy },
    { id: "CULTURAL", label: "Cultural", icon: Music },
  ];

  const filteredEvents =
    events?.filter((event) => {
      const matchesSearch = event.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchesCategory =
        selectedCategory === "ALL" || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }) || [];

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "TECH":
        return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
      case "CULTURAL":
        return "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10";
      case "SPORTS":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      default:
        return "text-gray-400 border-gray-500/30 bg-gray-500/10";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-cyan-400/30 animate-ping" />
          </div>
          <p className="text-gray-400 font-mono text-sm animate-pulse">
            INITIALIZING SYSTEM...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-mesh min-h-screen relative overflow-hidden">
      {/* Floating Particles */}
      <FloatingParticles />

      {/* Hex Pattern Overlay */}
      <div className="absolute inset-0 hex-pattern opacity-50 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-28 pb-24 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-40" />

        {/* Animated gradient orbs */}
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px] animate-pulse" />
        <div
          className="absolute bottom-0 right-10 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[150px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="container mx-auto px-4 text-center max-w-5xl relative z-10">
          {/* Glowing Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 text-sm font-mono mb-8 pulse-ring">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>FEBRUARY 20-22, 2026</span>
            <span className="text-gray-600">•</span>
            <span>GDEC CAMPUS</span>
          </div>

          {/* Main Title with Glitch Effect */}
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black tracking-wider mb-4">
            <span
              className="text-white text-glow-white glitch inline-block"
              data-text="TECH"
            >
              TECH
            </span>
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 glitch inline-block"
              data-text="FEST"
            >
              FEST
            </span>
          </h1>

          {/* Year with special styling */}
          <div className="relative inline-block mb-8">
            <span className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-gray-600 tracking-widest">
              20
            </span>
            <span className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-cyan-400 text-glow-cyan tracking-widest flicker">
              26
            </span>
          </div>

          {/* Typing Subtitle */}
          <div className="h-8 mb-10">
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              <TypingText text="The ultimate convergence of technology, innovation, and creativity..." />
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-12">
            <p className="text-gray-500 text-sm font-mono mb-4 uppercase tracking-widest">
              Event Starts In
            </p>
            <CountdownTimer targetDate={techFestDate} />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/events">
              <Button className="btn-neon bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold px-10 py-7 text-lg rounded-xl">
                <Zap className="mr-2 h-5 w-5" />
                EXPLORE EVENTS
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="outline"
                className="border-2 border-gray-700 text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/50 px-10 py-7 text-lg rounded-xl font-semibold"
              >
                REGISTER NOW
              </Button>
            </Link>
          </div>

          {/* Event Count Badge */}
          <div className="flex justify-center mt-8">
            <div className="relative group">
              {/* Glow effect behind */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-cyan-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all opacity-60 group-hover:opacity-100" />

              {/* Main badge */}
              <div className="relative bg-gradient-to-r from-gray-900/90 via-gray-950/95 to-gray-900/90 border border-cyan-500/30 rounded-2xl px-8 py-4 flex items-center gap-4 backdrop-blur-sm">
                {/* Icon with pulse */}
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
                    <Calendar className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-cyan-400 rounded-full animate-pulse" />
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-heading text-white">
                      {events?.length || 0}
                    </span>
                    <span className="text-xl font-bold text-cyan-400">+</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono uppercase tracking-widest">
                    Live Events
                  </span>
                </div>

                {/* Decorative line */}
                <div className="hidden sm:block h-8 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent mx-2" />

                {/* CTA - redirects based on auth status */}
                <Link to={user ? "/events" : "/login"} className="hidden sm:block">
                  <span className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors font-mono">
                    {user ? "VIEW EVENTS →" : "JOIN NOW →"}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 relative" id="events">
        {/* Scanning line effect */}
        <div className="absolute inset-0 scan-line pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white tracking-wide mb-4">
              <span className="text-cyan-400">&lt;</span>
              UPCOMING
              <span className="text-purple-400">/</span>
              EVENTS
              <span className="text-cyan-400">&gt;</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full" />
            <p className="text-gray-500 max-w-xl mx-auto mt-4 font-mono text-sm">
              // Discover events across tech, sports, and cultural domains
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-12 justify-between items-center p-5 rounded-2xl glass-card border-glow">
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap font-mono uppercase tracking-wide",
                      selectedCategory === cat.id
                        ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg glow-cyan"
                        : "bg-white/5 text-gray-400 border border-gray-800 hover:border-cyan-500/30 hover:text-cyan-400"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-gray-800 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-white placeholder:text-gray-600 font-mono text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Events Grid */}
          <div>
            {error ? (
              <div className="text-center py-12 glass-card rounded-xl border-red-500/20 text-red-400 font-mono">
                <p>ERROR: {error.message || "Failed to fetch"}</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20 glass-card rounded-xl border-gray-800 border-dashed">
                <Cpu className="h-16 w-16 mx-auto text-gray-700 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 font-heading">
                  NO EVENTS FOUND
                </h3>
                <p className="text-gray-500 font-mono text-sm">
                  {searchTerm || selectedCategory !== "ALL"
                    ? "// try adjusting your filters"
                    : "// check back later for new events"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, idx) => {
                  const isFull =
                    event.maxParticipants &&
                    event._count?.registrations >= event.maxParticipants;

                  return (
                    <div
                      key={event.id}
                      className="glass-card rounded-2xl overflow-hidden card-hover card-3d flex flex-col h-full group"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      {/* Image Section */}
                      <div className="h-48 relative overflow-hidden bg-gray-900">
                        {event.posterUrl ? (
                          <img
                            src={event.posterUrl}
                            alt={event.name}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                            <Cpu className="h-16 w-16 text-gray-700" />
                          </div>
                        )}
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Category Badge */}
                        <div className="absolute top-4 right-4">
                          <span
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider border backdrop-blur-sm",
                              getCategoryColor(event.category)
                            )}
                          >
                            {event.category}
                          </span>
                        </div>

                        {/* Event name on image */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white font-heading tracking-wide line-clamp-1 text-glow-white">
                            {event.name}
                          </h3>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 flex flex-col flex-grow">
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                          {event.description ||
                            "Join us for this amazing event! Register now to participate."}
                        </p>

                        <div className="space-y-2 mb-5">
                          <div className="flex items-center text-sm text-gray-400 font-mono">
                            <Calendar className="h-4 w-4 mr-2 text-cyan-500" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center text-sm text-gray-400 font-mono">
                            <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                            {event.location || "Venue TBA"}
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                            <div className="flex items-center text-sm text-gray-500 font-mono">
                              <Users className="h-4 w-4 mr-2 text-emerald-500" />
                              {event._count?.registrations || 0}
                              {event.maxParticipants
                                ? `/${event.maxParticipants}`
                                : ""}{" "}
                            </div>
                            <span className="font-bold text-cyan-400 font-mono text-lg">
                              {event.fees > 0 ? `₹${event.fees}` : "FREE"}
                            </span>
                          </div>
                        </div>

                        {isFull ? (
                          <Button
                            disabled
                            className="w-full bg-gray-800 text-gray-500 cursor-not-allowed font-mono"
                          >
                            SOLD OUT
                          </Button>
                        ) : (
                          <Link to={`/events/${event.id}`}>
                            <Button className="w-full btn-neon bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 hover:from-cyan-500 hover:to-purple-600 hover:text-white font-bold font-mono group/btn">
                              VIEW DETAILS
                              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 relative">
        <div className="absolute inset-0 hex-pattern opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 pulse-ring">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-heading font-bold text-xl">
                  <span className="text-cyan-400">TECH</span>
                  <span className="text-white">FEST</span>
                  <span className="text-purple-400 ml-1 font-mono">2026</span>
                </span>
                <p className="text-xs text-gray-600 font-mono">GDEC Campus</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 font-mono">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                ABOUT
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                CONTACT
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                PRIVACY
              </a>
            </div>
            <p className="text-sm text-gray-600 font-mono">
              © 2026 TECHFEST. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
