import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, MapPin, ArrowRight, Cpu, Zap, Trophy, Music, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/useEvents";
import { useDebounce } from "@/hooks/useDebounce";

export default function Events() {
  const { data: events, isLoading, error } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

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

  return (
    <div className="min-h-screen gradient-mesh pt-20 pb-12">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4 tracking-wide">
            <span className="text-cyan-400">&lt;</span>
            DISCOVER
            <span className="text-purple-400">/</span>
            EVENTS
            <span className="text-cyan-400">&gt;</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-500 max-w-2xl mx-auto font-mono text-sm">
            // Explore tech, sports, and cultural events at TechFest 2026
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-5 mb-10 border-glow">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
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
        </div>

        {/* Events Grid */}
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
                <p className="text-gray-500 font-mono text-sm">Loading events...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12 glass-card rounded-xl border-red-500/20 text-red-400 font-mono">
              ERROR: {error.message || "Failed to fetch events"}
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
              {filteredEvents.map((event, idx) => (
                <div
                  key={event.id}
                  className="glass-card rounded-2xl overflow-hidden card-hover card-3d flex flex-col h-full group"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
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
                      {event.description || "Join us for this amazing event!"}
                    </p>

                    <div className="space-y-2 mb-5">
                      <div className="flex items-center text-sm text-gray-400 font-mono">
                        <Calendar className="h-4 w-4 mr-2 text-cyan-500" />
                        {event.date
                          ? new Date(event.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          : "Date TBA"}
                      </div>
                      <div className="flex items-center text-sm text-gray-400 font-mono">
                        <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                        {event.location || "Venue TBA"}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                        <span className="text-gray-500 font-mono text-sm">
                          {event._count?.registrations || 0} registered
                        </span>
                        <span className="font-bold text-cyan-400 font-mono text-lg">
                          {event.fees > 0 ? `₹${event.fees}` : "FREE"}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/events/${event.id}`}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 hover:from-cyan-500 hover:to-purple-600 hover:text-white font-bold font-mono text-center transition-all flex items-center justify-center gap-2 group/btn btn-neon"
                    >
                      VIEW DETAILS
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
