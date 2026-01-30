import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, MapPin, Loader2, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const categories = ["ALL", "TECH", "CULTURAL", "SPORTS"];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-heading text-white mb-4">
          Discover Events
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore the latest competitions, workshops, and cultural fests
          happening on campus.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-secondary/30 p-4 rounded-xl border border-white/5">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto -mx-2 px-2 md:mx-0 md:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                selectedCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-background/50 text-gray-400 border-white/10 hover:border-primary/50 hover:text-white",
              )}
            >
              {cat === "ALL" ? "All Events" : cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background/50 border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white placeholder:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
          Error loading events: {error}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-secondary/30 rounded-lg border border-white/5 border-dashed">
          <Calendar className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
          <p className="text-gray-400">
            {searchTerm || selectedCategory !== "ALL"
              ? "Try adjusting your filters"
              : "Check back later for new events!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-background/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)] flex flex-col h-full"
            >
              {/* Image / Banner */}
              <div className="h-48 bg-secondary/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
                {/* Default Pattern or Image */}
                {event.posterUrl ? (
                  <img
                    src={event.posterUrl}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 bg-linear-to-br from-gray-800 to-gray-900">
                    <Calendar className="h-12 w-12 opacity-20" />
                  </div>
                )}
                <div className="absolute top-4 right-4 z-20">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md",
                      event.category === "TECH" &&
                        "text-indigo-300 bg-indigo-950/50 border-indigo-500/30",
                      event.category === "CULTURAL" &&
                        "text-amber-300 bg-amber-950/50 border-amber-500/30",
                      event.category === "SPORTS" &&
                        "text-emerald-300 bg-emerald-950/50 border-emerald-500/30",
                      !event.category &&
                        "text-gray-300 bg-gray-950/50 border-gray-500/30",
                    )}
                  >
                    {event.category || "EVENT"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-sm text-primary font-medium mb-2">
                  {event.date
                    ? new Date(event.date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Date TBA"}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {event.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                  {event.description || "No description provided."}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <span className="truncate max-w-[100px]">
                      {event.location || "TBA"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="font-semibold text-white">
                      {event.fees > 0 ? `₹${event.fees}` : "Free"}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/events/${event.id}`}
                  className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 text-center text-sm font-medium text-white transition-all flex items-center justify-center gap-2 group/btn"
                >
                  View Details
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
