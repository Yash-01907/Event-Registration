import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Users,
  Loader2,
  Search,
  ArrowRight,
} from "lucide-react";

export default function Landing() {
  const { data: events, isLoading, error } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const categories = ["ALL", "TECH", "CULTURAL", "SPORTS"];

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
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 text-gray-900 font-semibold mb-6">
            <Calendar className="h-5 w-5" />
            <span>CollegeFest 2026</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-6">
            Welcome to CollegeFest <br /> 2026
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Register for exciting events across Technology, Sports, and Cultural
            categories. Join us for an unforgettable experience!
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link to="/events">
              <Button className="bg-gray-950 text-white hover:bg-gray-800 px-8 py-6 text-base rounded-xl">
                Browse Events
              </Button>
            </Link>
            <Link to="/events">
              <Button
                variant="outline"
                className="border-gray-200 text-gray-900 hover:bg-gray-50 px-8 py-6 text-base rounded-xl"
              >
                View Schedule
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section with Search & Filter */}
      <section className="py-16 pb-24" id="events">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Browse through our wide range of events and find what interests
              you the most.
            </p>
          </div>

          {/* Filters & Search - Matching Events.jsx style */}
          <div
            role="search"
            aria-label="Event filters"
            className="flex flex-col md:flex-row gap-4 mb-12 justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100"
          >
            {/* Category Pills */}
            <div
              role="tablist"
              aria-label="Event categories"
              className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto -mx-2 px-2 md:mx-0 md:px-0"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  aria-controls="events-grid"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                    selectedCategory === cat
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-900",
                  )}
                >
                  {cat === "ALL" ? "All Events" : cat}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search events..."
                aria-label="Search events"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-gray-900 placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Events Grid */}
          <div id="events-grid" role="region" aria-live="polite">
            {error ? (
              <div className="text-center py-12 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
                Error loading events:{" "}
                {error.message || "Failed to fetch events"}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || selectedCategory !== "ALL"
                    ? "Try adjusting your filters"
                    : "Check back later for new events!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => {
                  const isFull =
                    event.maxParticipants &&
                    event._count?.registrations >= event.maxParticipants;

                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group"
                    >
                      {/* Image Section */}
                      <div className="h-48 relative overflow-hidden bg-gray-100">
                        {event.posterUrl ? (
                          <img
                            src={event.posterUrl}
                            alt={event.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                            <Calendar className="h-12 w-12" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <span
                            className={cn(
                              "px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm lowercase",
                              event.category === "TECH" && "text-indigo-700",
                              event.category === "CULTURAL" && "text-amber-700",
                              event.category === "SPORTS" && "text-emerald-700",
                              !event.category && "text-gray-900",
                            )}
                          >
                            {event.category}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                          {event.name}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                          {event.description ||
                            "Join us for this amazing event! Register now to participate."}
                        </p>

                        <div className="space-y-2 mb-6">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location || "Venue TBA"}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="h-4 w-4 mr-2" />
                              {event._count?.registrations || 0}
                              {event.maxParticipants
                                ? `/${event.maxParticipants}`
                                : ""}{" "}
                              registered
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">
                              {event.fees > 0 ? `₹${event.fees}` : "Free"}
                            </span>
                          </div>
                        </div>

                        {isFull ? (
                          <Button
                            disabled
                            className="w-full bg-gray-500 text-white cursor-not-allowed"
                          >
                            Fully Booked
                          </Button>
                        ) : (
                          <Link to={`/events/${event.id}`}>
                            <Button className="w-full bg-gray-950 text-white hover:bg-gray-800 flex items-center justify-center gap-2 group/btn">
                              Register Now
                              <ArrowRight
                                className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                                aria-hidden="true"
                              />
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
    </div>
  );
}
