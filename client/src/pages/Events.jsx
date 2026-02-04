import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/useEvents";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";

export default function Events() {
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

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-heading text-foreground mb-4">
          Discover Events
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore the latest competitions, workshops, and cultural fests
          happening on campus.
        </p>
      </div>

      {/* Filters */}
      <div
        role="search"
        aria-label="Event filters"
        className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-card p-4 rounded-xl border border-border"
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
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary hover:text-foreground",
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
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-foreground placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div id="events-grid" role="region" aria-live="polite">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="border border-border rounded-xl p-6 space-y-4"
              >
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
            Error loading events: {error.message || "Failed to fetch events"}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-secondary/10 rounded-lg border border-border border-dashed">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              No events found
            </h3>
            <p className="text-muted-foreground">
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
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col h-full"
              >
                {/* Image / Banner */}
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {/* Default Pattern or Image */}
                  {event.posterUrl ? (
                    <img
                      src={event.posterUrl}
                      alt={event.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground group-hover:bg-secondary/20 transition-colors">
                      <Calendar className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-20">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm",
                        event.category === "TECH" && "tech",
                        event.category === "CULTURAL" && "cultural",
                        event.category === "SPORTS" && "sports",
                        !event.category &&
                          "bg-secondary text-secondary-foreground",
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
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {event.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                    {event.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate max-w-[100px]">
                        {event.location || "TBA"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-auto">
                      <span className="font-semibold text-foreground">
                        {event.fees > 0 ? `₹${event.fees}` : "Free"}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/events/${event.id}`}
                    aria-label={`View details for ${event.name}`}
                    className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-center text-sm font-medium text-primary-foreground transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    View Details
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
